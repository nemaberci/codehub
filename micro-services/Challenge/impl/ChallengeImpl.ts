import {Challenge} from "../../client/returnedTypes";
import {
    AddControlSolutionBody,
    AddTestCasesBody,
    GetBody,
    ListBody,
    ListByUserBody,
    UploadBody
} from "../types/EndpointInputTypes";
import ChallengeService from "../api/ChallengeService";
import FileHandlingClient from "../../client/FileHandlingClient";
import {randomUUID} from "crypto";
import {initializeApp, applicationDefault, cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {PubSub} from "@google-cloud/pubsub";
import {File} from "../../client/inputTypes";
import {
    AddControlSolutionReturned,
    AddTestCasesReturned,
    GetReturned, ListByUserReturned,
    ListReturned
} from "../types/EndpointReturnedTypes";
import {decode} from "jsonwebtoken";
import * as model from "../../client/returnedTypes";

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class ChallengeImpl implements ChallengeService {
    async upload(body: UploadBody): Promise<Challenge> {

        const db = getFirestore();

        let challengeId = "challenge-" + randomUUID().toString();
        let challenge = {
            created_by: decode(body.authToken, {json: true})!.userId,
            description: body.description,
            language_name: body.controlSolution?.language ?? "",
            name: body.name,
            short_description: body.shortDescription,
            time_uploaded: new Date(),
            enabled_languages: body.enabledLanguages
        };
        Object.keys(challenge).forEach(key => challenge[key as keyof typeof challenge] === undefined && delete challenge[key as keyof typeof challenge])
        await db.collection("Challenge").doc(challengeId).set(challenge);

        return await this.freshDTO(body.authToken, challengeId);

    }

    async addControlSolution(body: AddControlSolutionBody): Promise<AddControlSolutionReturned> {

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;

        let folderName = "solution-source-" + randomUUID().toString();

        await fileHandlingClient.uploadFolderContent(
            body.authToken,
            folderName,
            body.controlSolution.folderContents
        );
        console.log("Uploaded folder contents to: ", folderName)
        let solutionId = "solution-" + randomUUID().toString();

        await db.collection("Solution").doc(solutionId).set({
            challenge_name: body.challengeId,
            entry_point: body.controlSolution?.entryPoint ?? "Solution.java",
            time_submitted: new Date(),
            source_folder: folderName,
            user: decode(body.authToken, {json: true})!.userId,
            language: body.controlSolution.language,
        });

        await db.collection("Challenge").doc(body.challengeId).update({
            solution_id: db.collection("Solution").doc(solutionId)
        });
        console.log("Uploaded solution to firestore: ", solutionId);

        // todo: normal language handling
        if (!["java", "cpp"].includes(body.controlSolution.language ?? "java")) {
            throw new Error("Language not supported");
        }

        const pubsub = new PubSub();
        const topicName = "SolutionUploaded";
        await pubsub.topic(topicName).publishMessage(
            {
                attributes: {
                    sourceFolderName: folderName,
                    challengeId: body.challengeId,
                    entryPoint: body.controlSolution.entryPoint ?? "Solution.java",
                    solutionId: solutionId,
                    secretName: (process.env as any)["SECRET_FILE_NAME"],
                    imageName: `${body.controlSolution.language ?? 'java'}-builder`
                }
            }
        );
        const subscriptionName = `control-solution-uploaded-${randomUUID().toString()}`;
        const [subscription] = await pubsub.topic("SolutionResultsUploaded").createSubscription(
            subscriptionName,
            {
                filter: `attributes.solutionId = "${solutionId}"`
            }
        )
        subscription.on("message", async (message) => {
            console.log("Received message: ", message.data.toString());
            const solutionResultsSnapshot = await db
                .collection("Solution")
                .doc(solutionId)
                .collection("Result")
                .doc("Result")
                .collection("SubResults")
                .get();
            const testCaseTimes = solutionResultsSnapshot.docs
                .map(d => d.data())
                .map(
                    d => ({
                        id: d.test_case_id as string,
                        time: d.runtime as number
                    })
                );
            const testCaseMemories = solutionResultsSnapshot.docs
                .map(d => d.data())
                .map(
                    d => ({
                        id: d.test_case_id as string,
                        memory: d.memory as number
                    })
                );
            testCaseTimes.forEach(
                async (testCaseTime) => {
                    await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseTime.id).update({
                        max_runtime: testCaseTime.time * 2
                    })
                }
            )
            testCaseMemories.forEach(
                async (testCaseMemory) => {
                    await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseMemory.id).update({
                        max_memory: testCaseMemory.memory * 2
                    })
                }
            )
            console.log("Updated challenge with control solution: ", body.challengeId);
            message.ack();
            await subscription.close();
        })
        setTimeout(
            async () => {
                await subscription.close();
            },
            1000 * 60 * 60 // 1 hour
        )
        console.log("Published message to pubsub topic: ", topicName);

        return await this.freshDTO(body.authToken, body.challengeId);

    }

    async addTestCases(body: AddTestCasesBody): Promise<AddTestCasesReturned> {

        // todo: update test cases instead of deleting and reuploading

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;

        let outputVerifierLocation = "output-verifier-" + randomUUID().toString();
        let scriptLocation = "script-" + randomUUID().toString();
        let textLocation = "text-" + randomUUID().toString();
        let resultsLocation = "results-" + randomUUID().toString();

        if (body.outputVerifier) {
            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                outputVerifierLocation,
                [body.outputVerifier]
            );
            console.log("Uploaded output verifier to: ", outputVerifierLocation)
            await db.collection("Challenge").doc(body.challengeId).update({
                output_verifier_location: outputVerifierLocation
            });
        }

        let inputFiles: File[] = []
        let inputGeneratorFiles: File[] = [];
        let testCaseFileNames: string[] = [];

        let outputFiles: File[] = [];
        let outputFilesNames: string[] = [];

        for (let testCase of (body.testCases ?? [])) {
            if (!testCase.input && !testCase.inputGenerator) {
                throw new Error("Test case must have input or input generator");
            }
            if (testCase.input) {
                testCaseFileNames.push(`input_${testCaseFileNames.length}.txt`);
                inputFiles.push({
                    content: testCase.input,
                    name: `input_${testCaseFileNames.length - 1}.txt`
                });
            }
            if (testCase.inputGenerator) {
                testCaseFileNames.push(testCase.inputGenerator.name);
                inputGeneratorFiles.push(testCase.inputGenerator);
            }
            // todo: output is constant
            if (testCase.output) {
                let outputName = "output-" + randomUUID().toString();
                outputFiles.push({
                    content: testCase.output,
                    name: outputName
                });
                outputFilesNames.push(outputName);
            } else {
                if (!body.outputVerifier) {
                    throw new Error("Test case must have output or challenge must have output verifier");
                }
                outputFilesNames.push("");
            }
        }

        if (inputFiles.length > 0) {
            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                textLocation,
                inputFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                text_location: textLocation
            });
            console.log("Uploaded input files to: ", textLocation)
        }

        if (inputGeneratorFiles.length > 0) {
            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                scriptLocation,
                inputGeneratorFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                script_location: scriptLocation
            });
            console.log("Uploaded input generators to: ", scriptLocation)
        }

        if (outputFiles.length > 0) {
            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                resultsLocation,
                outputFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                results_location: resultsLocation
            });
            console.log("Uploaded output files to: ", resultsLocation)
        }

        const testCases = await db.collection("Challenge").doc(body.challengeId).collection("Testcases").get()
        for (let doc of testCases.docs) {
            await doc.ref.delete();
        }
        console.log("Deleted previous test cases from firestore");

        for (let i in (body.testCases ?? [])) {
            let testCase = (body.testCases ?? [])[i];
            let testCaseId = "test-case-" + randomUUID().toString();
            console.log("Creating test case: ", {
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                output_file_location: outputFilesNames[i],
                max_memory: testCase.maxMemory,
                max_runtime: testCase.maxTime,
                points: testCase.points,
                name: testCase.name,
                overhead_multiplier: testCase.overheadMultiplier
            });
            await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseId).set({
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                output_file_location: outputFilesNames[i],
                max_memory: testCase.maxMemory,
                max_runtime: testCase.maxTime,
                points: testCase.points,
                name: testCase.name,
                overhead_multiplier: testCase.overheadMultiplier
            })
            console.log("Uploaded test case to firestore: ", testCaseId)
        }

        return await this.freshDTO(body.authToken, body.challengeId);
    }

    private async freshDTO(authToken: string, challengeId: string): Promise<Challenge> {
        const db = getFirestore();
        const challenge = await db.collection("Challenge").doc(challengeId).get();

        let fileHandlingClient = FileHandlingClient;
        let testCases: model.Testcase[] = [];
        for (let testCase of (await db.collection("Challenge").doc(challengeId).collection("Testcases").get()).docs) {
            console.log("testcase: ", testCase.data())
            console.log("challenge:", challenge.data());
            const inputFile = await fileHandlingClient.downloadFile(
                authToken,
                challenge.data()!.text_location + "/" + testCase.data().location
            );
            const outputFile = await fileHandlingClient.downloadFile(
                authToken,
                challenge.data()!.results_location + "/" + testCase.data().output_file_location
            )
            testCases.push({
                id: testCase.id,
                name: testCase.data().name,
                description: testCase.data().description,
                points: testCase.data().points,
                maxMemory: testCase.data().max_memory,
                maxTime: testCase.data().max_runtime,
                input: Buffer.from(inputFile.content, 'base64').toString(),
                inputGenerated: testCase.data().is_generated,
                output: Buffer.from(outputFile.content, 'base64').toString(),
                overheadMultiplier: testCase.data().overhead_multiplier
            })
        }

        return {
            id: challengeId,
            name: challenge.data()!.name,
            description: challenge.data()!.description,
            shortDescription: challenge.data()!.short_description,
            userId: challenge.data()!.created_by,
            createdAt: challenge.data()!.time_uploaded,
            testCases: testCases,
            enabledLanguages: challenge.data()!.enabled_languages
        };
    }

    async get(body: GetBody): Promise<GetReturned> {
        console.log(body);
        return await this.freshDTO(body.authToken, body.challengeId);
    }

    async list(body: ListBody): Promise<ListReturned> {
        const db = getFirestore();
        const challenges = await db.collection("Challenge").get();
        const challengeDTOs: Challenge[] = [];

        for (let challenge of challenges.docs) {
            challengeDTOs.push({
                id: challenge.id,
                name: challenge.data().name,
                description: challenge.data().description,
                userId: challenge.data().created_by,
                shortDescription: challenge.data().short_description,
                createdAt: challenge.data()!.time_uploaded,
                testCases: (await db.collection("Challenge").doc(challenge.id).collection("Testcases").get()).docs.map(
                    d => ({
                        id: d.id,
                        name: d.data().name,
                        description: d.data().description,
                        points: d.data().points,
                        maxMemory: d.data().max_memory,
                        maxTime: d.data().max_runtime,
                        output: null,
                        inputGenerated: null,
                        input: null,
                        overheadMultiplier: d.data().overhead_multiplier
                    })
                ),
                enabledLanguages: challenge.data().enabled_languages
            });
        }

        return challengeDTOs;
    }

    async listByUser(body: ListByUserBody): Promise<ListByUserReturned> {
        const db = getFirestore();
        const challenges = await db.collection("Challenge").where(
            "user",
            "==",
            body.userId
        ).get();
        const challengeDTOs: Challenge[] = [];

        for (let challenge of challenges.docs) {
            challengeDTOs.push({
                id: challenge.id,
                name: challenge.data().name,
                description: challenge.data().description,
                userId: challenge.data().created_by,
                createdAt: challenge.data()!.time_uploaded,
                shortDescription: challenge.data().short_description,
                testCases: (await db.collection("Challenge").doc(challenge.id).collection("Testcases").get()).docs.map(
                    d => ({
                        id: d.id,
                        name: d.data().name,
                        description: d.data().description,
                        points: d.data().points,
                        maxMemory: d.data().max_memory,
                        maxTime: d.data().max_runtime,
                        output: null,
                        inputGenerated: null,
                        input: null,
                        overheadMultiplier: d.data().overhead_multiplier
                    })
                ),
                enabledLanguages: challenge.data().enabled_languages
            });
        }

        return challengeDTOs;
    }
}
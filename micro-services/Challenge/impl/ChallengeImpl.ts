import {Challenge} from "../../client/returnedTypes";
import {
    AddControlSolutionBody,
    AddTestCasesBody,
    DeleteBody,
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
    DeleteReturned,
    GetReturned, ListByUserReturned,
    ListReturned
} from "../types/EndpointReturnedTypes";
import {decode} from "jsonwebtoken";
import * as model from "../../client/returnedTypes";
import {firestore} from "firebase-admin";
import FieldValue = firestore.FieldValue;

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class ChallengeImpl implements ChallengeService {

    async delete(body: DeleteBody): Promise<DeleteReturned> {
        const db = getFirestore();

        await db.collection("Challenge").doc(body.challengeId).delete();

        return true;
    }

    async upload(body: UploadBody): Promise<Challenge> {

        const db = getFirestore();

        let challengeId = "challenge-" + randomUUID().toString();
        let challenge = {
            created_by: decode(body.authToken, {json: true})!.userId,
            description: body.description,
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

        // Reset current limits

        const testCases = await db.collection("Challenge").doc(body.challengeId).collection("Testcases").get()
        for (let doc of testCases.docs) {
            // For each enabled language, reset the limits
            await doc.ref.collection("limits").doc(body.controlSolution.language).delete();
            await doc.ref.collection("limits").doc(body.controlSolution.language).set({
                // 30 seconds, 500 MB
                max_runtime: 30_000,
                max_memory: 500_000
            });
        }

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
            const solutionLanguage: string = (await db.collection("Solution").doc(solutionId).get()).data()!.language;
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
                    const overheadMultiplier = (await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseTime.id).get())
                        .data()!
                        .overhead_multiplier;
                    await db.collection("Challenge").doc(body.challengeId)
                        .collection("Testcases")
                        .doc(testCaseTime.id)
                        .collection("limits")
                        .doc(solutionLanguage)
                        .update({
                        max_runtime: testCaseTime.time * overheadMultiplier
                    })
                }
            )
            testCaseMemories.forEach(
                async (testCaseMemory) => {
                    const overheadMultiplier = (await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseMemory.id).get())
                        .data()!
                        .overhead_multiplier;
                    await db.collection("Challenge").doc(body.challengeId)
                        .collection("Testcases")
                        .doc(testCaseMemory.id)
                        .collection("limits")
                        .doc(solutionLanguage)
                        .update({
                        max_memory: testCaseMemory.memory * overheadMultiplier
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

        return await this.internalDTO(body.authToken, body.challengeId);

    }

    async addTestCases(body: AddTestCasesBody): Promise<AddTestCasesReturned> {

        // todo: update test cases instead of deleting and reuploading

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;
        const challenge = (await db.collection("Challenge").doc(body.challengeId).get()).data()!;

        let outputVerifierLocation;
        let scriptLocation;
        let textLocation;
        let resultsLocation;

        if (body.outputVerifier) {

            if (challenge.output_verifier_location) {
                await fileHandlingClient.deleteFolder(
                    body.authToken,
                    challenge.output_verifier_location
                );
                console.log("Deleted previous output verifier from: ", challenge.output_verifier_location)
                outputVerifierLocation = challenge.output_verifier_location;
            } else {
                outputVerifierLocation = "output-verifier-" + randomUUID().toString();
            }

            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                outputVerifierLocation,
                [body.outputVerifier]
            );
            console.log("Uploaded output verifier to: ", outputVerifierLocation)
            await db.collection("Challenge").doc(body.challengeId).update({
                output_verifier_location: outputVerifierLocation
            });
        } else {
            await db.collection("Challenge").doc(body.challengeId).update({
                output_verifier_location: FieldValue.delete()
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

            if (challenge.text_location) {
                await fileHandlingClient.deleteFolder(
                    body.authToken,
                    challenge.text_location
                );
                console.log("Deleted previous input files from: ", challenge.text_location)
                textLocation = challenge.text_location;
            } else {
                textLocation = "text-" + randomUUID().toString();
            }

            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                textLocation,
                inputFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                text_location: textLocation
            });
            console.log("Uploaded input files to: ", textLocation)
        } else {
            await db.collection("Challenge").doc(body.challengeId).update({
                text_location: FieldValue.delete()
            });
        }

        if (inputGeneratorFiles.length > 0) {

            if (challenge.script_location) {
                await fileHandlingClient.deleteFolder(
                    body.authToken,
                    challenge.script_location
                );
                console.log("Deleted previous input generators from: ", challenge.script_location)
                scriptLocation = challenge.script_location;
            } else {
                scriptLocation = "script-" + randomUUID().toString();
            }

            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                scriptLocation,
                inputGeneratorFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                script_location: scriptLocation
            });
            console.log("Uploaded input generators to: ", scriptLocation)
        } else {
            await db.collection("Challenge").doc(body.challengeId).update({
                script_location: FieldValue.delete()
            });
        }

        if (outputFiles.length > 0) {

            if (challenge.results_location) {
                await fileHandlingClient.deleteFolder(
                    body.authToken,
                    challenge.results_location
                );
                console.log("Deleted previous output files from: ", challenge.results_location)
                resultsLocation = challenge.results_location;
            } else {
                resultsLocation = "results-" + randomUUID().toString();
            }

            await fileHandlingClient.uploadFolderContent(
                body.authToken,
                resultsLocation,
                outputFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                results_location: resultsLocation
            });
            console.log("Uploaded output files to: ", resultsLocation)
        } else {
            await db.collection("Challenge").doc(body.challengeId).update({
                results_location: FieldValue.delete()
            });
        }

        let testCasesToKeep = [];

        for (let i in (body.testCases ?? [])) {
            let testCase = (body.testCases ?? [])[i];
            let testCaseId = body.testCases![i].id
                ?? "test-case-" + randomUUID().toString();
            testCasesToKeep.push(testCaseId);
            console.log("Creating / updating test case: ", {
                id: testCaseId,
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                output_file_location: outputFilesNames[i],
                points: testCase.points,
                name: testCase.name,
                overhead_multiplier: testCase.overheadMultiplier
            });
            await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseId).set({
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                output_file_location: outputFilesNames[i],
                points: testCase.points,
                name: testCase.name,
                overhead_multiplier: testCase.overheadMultiplier
            })
            console.log("Uploaded test case to firestore: ", testCaseId)
        }

        const testCasesToDelete = await db.collection("Challenge").doc(body.challengeId).collection("Testcases").get();
        for (let doc of testCasesToDelete.docs) {
            if (!testCasesToKeep.includes(doc.id)) {
                await doc.ref.delete();
            }
        }

        return await this.internalDTO(body.authToken, body.challengeId);
    }

    private async freshDTO(authToken: string, challengeId: string): Promise<Challenge> {
        const db = getFirestore();
        const challenge = await db.collection("Challenge").doc(challengeId).get();
        const currentUserId = decode(authToken, {json: true})!.userId;
        const isOwner = currentUserId === challenge.data()!.created_by;

        let fileHandlingClient = FileHandlingClient;
        let testCases: model.Testcase[] = [];
        for (let testCase of (await db.collection("Challenge").doc(challengeId).collection("Testcases").get()).docs) {
            console.log("testcase: ", testCase.data())
            console.log("challenge:", challenge.data());
            let inputFile: File | null = null;
            let outputFile: File | null = null;

            if (isOwner) {
                if (challenge.data()!.text_location === undefined) {
                    inputFile = await fileHandlingClient.downloadFile(
                        authToken,
                        challenge.data()!.script_location + "/" + testCase.data()!.location
                    );
                } else {
                    inputFile = await fileHandlingClient.downloadFile(
                        authToken,
                        challenge.data()!.text_location + "/" + testCase.data().location
                    );
                }

                if (challenge.data()!.results_location !== undefined) {
                    outputFile = await fileHandlingClient.downloadFile(
                        authToken,
                        challenge.data()!.results_location + "/" + testCase.data().output_file_location
                    );
                }
            }

            let limits = await testCase.ref.collection("limits").get();
            testCases.push({
                id: testCase.id,
                name: testCase.data().name,
                description: testCase.data().description,
                points: testCase.data().points,
                limits: limits.docs.map(
                    d => ({
                        memory: d.data().max_memory,
                        time: d.data().max_runtime,
                        language: d.ref.id
                    })
                ),
                input: inputFile ? Buffer.from(inputFile.content, 'base64').toString() : null,
                inputGenerated: testCase.data().is_generated,
                output: outputFile ? Buffer.from(outputFile.content, 'base64').toString() : null,
                overheadMultiplier: testCase.data().overhead_multiplier
            })
        }

        let outputVerifier: string | null = null;
        if (isOwner && challenge.data()!.output_verifier_location) {
            let outputVerifierFile = await FileHandlingClient.downloadFile(
                authToken,
                challenge.data()!.output_verifier_location + "/verifier.py"
            );
            outputVerifier = Buffer.from(outputVerifierFile.content, 'base64').toString();
        }

        return {
            id: challengeId,
            name: challenge.data()!.name,
            description: challenge.data()!.description,
            shortDescription: challenge.data()!.short_description,
            userId: challenge.data()!.created_by,
            createdAt: challenge.data()!.time_uploaded,
            testCases: testCases,
            enabledLanguages: challenge.data()!.enabled_languages,
            outputScript: outputVerifier,
            isOutputScript: !!challenge.data()!.output_verifier_location
        };
    }

    private async internalDTO(authToken: string, challengeId: string): Promise<Challenge> {
        const db = getFirestore();
        const challenge = await db.collection("Challenge").doc(challengeId).get();

        let fileHandlingClient = FileHandlingClient;
        let testCases: model.Testcase[] = [];
        for (let testCase of (await db.collection("Challenge").doc(challengeId).collection("Testcases").get()).docs) {
            console.log("testcase: ", testCase.data())
            console.log("challenge:", challenge.data());
            let inputFile: File;
            if (challenge.data()!.text_location === undefined) {
                inputFile = await fileHandlingClient.downloadFile(
                    authToken,
                    challenge.data()!.script_location + "/" + testCase.data()!.location
                );
            } else {
                inputFile = await fileHandlingClient.downloadFile(
                    authToken,
                    challenge.data()!.text_location + "/" + testCase.data().location
                );
            }
            let outputFile: File;
            if (challenge.data()!.results_location === undefined) {
                outputFile = {
                    name: "output",
                    content: ""
                }
            } else {
                outputFile = await fileHandlingClient.downloadFile(
                    authToken,
                    challenge.data()!.results_location + "/" + testCase.data().output_file_location
                )
            }
            let limits = await testCase.ref.collection("limits").get();
            testCases.push({
                id: testCase.id,
                name: testCase.data().name,
                description: testCase.data().description,
                points: testCase.data().points,
                limits: limits.docs.map(
                    d => ({
                        memory: d.data().max_memory,
                        time: d.data().max_runtime,
                        language: d.ref.id
                    })
                ),
                input: Buffer.from(inputFile.content, 'base64').toString(),
                inputGenerated: testCase.data().is_generated,
                output: Buffer.from(outputFile.content, 'base64').toString(),
                overheadMultiplier: testCase.data().overhead_multiplier
            })
        }

        let outputVerifier: string | null = null;
        if (challenge.data()!.output_verifier_location) {
            let outputVerifierFile = await FileHandlingClient.downloadFile(
                authToken,
                challenge.data()!.output_verifier_location + "/verifier.py"
            );
            outputVerifier = Buffer.from(outputVerifierFile.content, 'base64').toString();
        }

        return {
            id: challengeId,
            name: challenge.data()!.name,
            description: challenge.data()!.description,
            shortDescription: challenge.data()!.short_description,
            userId: challenge.data()!.created_by,
            createdAt: challenge.data()!.time_uploaded,
            testCases: testCases,
            enabledLanguages: challenge.data()!.enabled_languages,
            outputScript: outputVerifier,
            isOutputScript: !!outputVerifier
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
            challengeDTOs.push(await this.freshDTO(body.authToken, challenge.id));
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
            challengeDTOs.push(await this.freshDTO(body.authToken, challenge.id));
        }

        return challengeDTOs;
    }
}
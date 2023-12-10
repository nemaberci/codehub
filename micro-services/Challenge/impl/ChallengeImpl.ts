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

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class ChallengeImpl implements ChallengeService {
    async upload(body: UploadBody): Promise<Challenge> {

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;

        let challengeId = "challenge-" + randomUUID().toString();
        await db.collection("Challenge").doc(challengeId).set({
            created_by: "todo",
            description: body.description,
            language_name: body.controlSolution?.language ?? "",
            name: body.name,
            short_description: body.shortDescription,
            time_uploaded: new Date()
        });

        let outputVerifierLocation = "output-verifier-" + randomUUID().toString();
        let scriptLocation = "script-" + randomUUID().toString();
        let textLocation = "text-" + randomUUID().toString();

        if (body.outputVerifier) {
            await fileHandlingClient.uploadFolderContent(
                (process.env as any).FILE_HANDLING_API_KEY,
                outputVerifierLocation,
                [body.outputVerifier]
            );
            console.log("Uploaded output verifier to: ", outputVerifierLocation)
            await db.collection("Challenge").doc(challengeId).update({
                output_verifier_location: outputVerifierLocation
            });
        }

        let inputFiles: File[] = []
        let inputGeneratorFiles: File[] = [];
        let testCaseFileNames: string[] = [];

        // let outputFiles: File[] = [];
        // let outputFilesNames: string[] = [];

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
            // if (testCase.output) {
            //     let outputName = "output-" + randomUUID().toString();
            //     outputFiles.push({
            //         content: testCase.output,
            //         name: outputName
            //     });
            //     outputFilesNames.push(outputName);
            // } else {
            //     if (!body.outputVerifier) {
            //         throw new Error("Test case must have output or challenge must have output verifier");
            //     }
            //     outputFilesNames.push("");
            // }
        }

        if (inputFiles.length > 0) {
            await fileHandlingClient.uploadFolderContent(
                (process.env as any).FILE_HANDLING_API_KEY,
                textLocation,
                inputFiles
            );
            await db.collection("Challenge").doc(challengeId).update({
                text_location: textLocation
            });
            console.log("Uploaded input files to: ", textLocation)
        }

        if (inputGeneratorFiles.length > 0) {
            await fileHandlingClient.uploadFolderContent(
                (process.env as any).FILE_HANDLING_API_KEY,
                scriptLocation,
                inputGeneratorFiles
            );
            await db.collection("Challenge").doc(challengeId).update({
                script_location: scriptLocation
            });
            console.log("Uploaded input generators to: ", scriptLocation)
        }

        for (let i in (body.testCases ?? [])) {
            let testCase = (body.testCases ?? [])[i];
            let testCaseId = "test-case-" + randomUUID().toString();
            console.log("Creating test case: ", {
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                max_memory: testCase.maxMemory,
                max_runtime: testCase.maxTime,
                points: testCase.points,
                name: testCase.name
            });
            await db.collection("Challenge").doc(challengeId).collection("Testcases").doc(testCaseId).set({
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                max_memory: testCase.maxMemory,
                max_runtime: testCase.maxTime,
                points: testCase.points,
                name: testCase.name
            })
            console.log("Uploaded test case to firestore: ", testCaseId)
        }

        if (body.controlSolution) {
            let folderName = "solution-source-" + randomUUID().toString();

            await fileHandlingClient.uploadFolderContent(
                (process.env as any).FILE_HANDLING_API_KEY,
                folderName,
                body.controlSolution.folderContents
            );
            console.log("Uploaded folder contents to: ", folderName)
            let solutionId = "solution-" + randomUUID().toString();

            await db.collection("Solution").doc(solutionId).set({
                challenge_name: challengeId,
                entry_point: body.controlSolution?.entryPoint ?? "Solution.java",
                time_submitted: new Date(),
                source_folder: folderName,
                user: "todo",
            });

            await db.collection("Challenge").doc(challengeId).update({
                solution_id: db.collection("Solution").doc(solutionId)
            });
            console.log("Uploaded solution to firestore: ", solutionId);

            const pubsub = new PubSub();
            const topicName = "SolutionUploaded";
            await pubsub.topic(topicName).publishMessage(
                {
                    attributes: {
                        sourceFolderName: folderName,
                        challengeId: challengeId,
                        entryPoint: body.controlSolution.entryPoint ?? "Solution.java",
                        solutionId: solutionId
                    }
                }
            );
            console.log("Published message to pubsub topic: ", topicName);
        }

        return await this.freshDTO(challengeId);

    }

    async addControlSolution(body: AddControlSolutionBody): Promise<AddControlSolutionReturned> {

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;

        let folderName = "solution-source-" + randomUUID().toString();

        await fileHandlingClient.uploadFolderContent(
            (process.env as any).FILE_HANDLING_API_KEY,
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
            user: "todo",
        });

        await db.collection("Challenge").doc(body.challengeId).update({
            solution_id: db.collection("Solution").doc(solutionId)
        });
        console.log("Uploaded solution to firestore: ", solutionId);

        const pubsub = new PubSub();
        const topicName = "SolutionUploaded";
        await pubsub.topic(topicName).publishMessage(
            {
                attributes: {
                    sourceFolderName: folderName,
                    challengeId: body.challengeId,
                    entryPoint: body.controlSolution.entryPoint ?? "Solution.java",
                    solutionId: solutionId
                }
            }
        );
        console.log("Published message to pubsub topic: ", topicName);

        return await this.freshDTO(body.challengeId);

    }

    async addTestCases(body: AddTestCasesBody): Promise<AddTestCasesReturned> {

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;

        let outputVerifierLocation = "output-verifier-" + randomUUID().toString();
        let scriptLocation = "script-" + randomUUID().toString();
        let textLocation = "text-" + randomUUID().toString();
        let resultsLocation = "results-" + randomUUID().toString();

        if (body.outputVerifier) {
            await fileHandlingClient.uploadFolderContent(
                (process.env as any).FILE_HANDLING_API_KEY,
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
                (process.env as any).FILE_HANDLING_API_KEY,
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
                (process.env as any).FILE_HANDLING_API_KEY,
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
                (process.env as any).FILE_HANDLING_API_KEY,
                resultsLocation,
                outputFiles
            );
            await db.collection("Challenge").doc(body.challengeId).update({
                results_location: resultsLocation
            });
            console.log("Uploaded output files to: ", resultsLocation)
        }

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
                name: testCase.name
            });
            await db.collection("Challenge").doc(body.challengeId).collection("Testcases").doc(testCaseId).set({
                description: testCase.description,
                is_generated: !!testCase.inputGenerator,
                location: testCaseFileNames[i],
                output_file_location: outputFilesNames[i],
                max_memory: testCase.maxMemory,
                max_runtime: testCase.maxTime,
                points: testCase.points,
                name: testCase.name
            })
            console.log("Uploaded test case to firestore: ", testCaseId)
        }

        return await this.freshDTO(body.challengeId);
    }

    private async freshDTO(challengeId: string) {
        const db = getFirestore();
        const challenge = await db.collection("Challenge").doc(challengeId).get();

        return {
            id: challengeId,
            name: challenge.data()!.name,
            description: challenge.data()!.description,
            user: challenge.data()!.created_by,
            testCases: (await db.collection("Challenge").doc(challengeId).collection("Testcases").get()).docs.map(
                d => ({
                    id: d.id,
                    name: d.data().name,
                    description: d.data().description,
                    points: d.data().points
                })
            )
        };
    }

    async get(body: GetBody): Promise<GetReturned> {
        return await this.freshDTO(body.challengeId);
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
                user: challenge.data().created_by,
                testCases: (await db.collection("Challenge").doc(challenge.id).collection("Testcases").get()).docs.map(
                    d => ({
                        id: d.id,
                        name: d.data().name,
                        description: d.data().description,
                        points: d.data().points
                    })
                )
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
                user: challenge.data().created_by,
                testCases: (await db.collection("Challenge").doc(challenge.id).collection("Testcases").get()).docs.map(
                    d => ({
                        id: d.id,
                        name: d.data().name,
                        description: d.data().description,
                        points: d.data().points
                    })
                )
            });
        }

        return challengeDTOs;
    }
}
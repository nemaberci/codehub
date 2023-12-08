import { Challenge } from "../../client/returnedTypes";
import { UploadBody } from "../types/EndpointInputTypes";
import ChallengeService from "../api/ChallengeService";
import FileHandlingClient from "../../client/FileHandlingClient";
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { PubSub } from "@google-cloud/pubsub";
import { File } from "../../client/inputTypes";
import challenge from "../../client/returnedTypes/Challenge";

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
            language_name: body.controlSolution.language,
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
        let outputFiles: File[] = [];
        let testCaseFileNames: string[] = [];
        let outputFilesNames: string[] = [];

        for (let testCase of body.testCases!) {
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

        for (let i in body.testCases!) {
            let testCase = body.testCases[i];
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
            entry_point: body.controlSolution.entryPoint ?? "Solution.java",
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

        return {
            id: folderName
        };

    }
}
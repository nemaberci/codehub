import { Solution } from "../../client/returnedTypes";
import SolutionService from "../api/SolutionService";
import {ListBody, ResultBody, SolveBody} from "../types/EndpointInputTypes";
import FileHandlingClient from '../../client/FileHandlingClient';
import { decode } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PubSub } from "@google-cloud/pubsub";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {ListReturned, ResultReturned} from "../types/EndpointReturnedTypes";

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class SolutionImpl implements SolutionService {
    async results(body: any): Promise<any[]> {
        const db = getFirestore()
        let results = await db.collection("Solution").doc(body.solutionId).collection("Result").doc("Result").collection("SubResults").get()
        console.log(results)

        return results.docs.map(d => d.data()).map(d => ({
            points: d.points as number,
            testCaseId: d.test_case_id as string,
            memory: d.memory as number,
            time: d.runtime as number
        }))
    }
    async solve(body: SolveBody): Promise<Solution> {

        const db = getFirestore();
        let fileHandlingClient = FileHandlingClient;
        let folderName = "solution-source-" + randomUUID().toString();
        await fileHandlingClient.uploadFolderContent(
            (process.env as any).FILE_HANDLING_API_KEY,
            folderName,
            body.folderContents
        );
        console.log("Uploaded folder contents to: ", folderName)
        let solutionId = "solution-" + randomUUID().toString();

        await db.collection("Solution").doc(solutionId).set({
            challenge_name: body.challengeId,
            entry_point: body.entryPoint ?? "Solution.java",
            time_submitted: new Date(),
            source_folder: folderName,
            user: "todo",
        });
        console.log("Uploaded solution to firestore: ", solutionId);

        const pubsub = new PubSub();
        const topicName = "SolutionUploaded";
        await pubsub.topic(topicName).publishMessage(
            {
                attributes: {
                    sourceFolderName: folderName,
                    challengeId: body.challengeId,
                    entryPoint: body.entryPoint ?? "Solution.java",
                    solutionId: solutionId
                }
            }
        );
        console.log("Published message to pubsub topic: ", topicName);

        const userId = decode(body.authToken, {json: true})!["userId"];

        return {
            id: folderName,
            challengeId: body.challengeId,
            user: userId,
            testCaseResults: []
        };

    }

    async result(body: ResultBody): Promise<ResultReturned> {
        const db = getFirestore()
        let solution = (await db.collection("Solution")
            .where(
                "user",
                "==",
                body.userId
            )
            .where(
                "challenge_name",
                "==",
                body.challengeId
            )
            .get())
            .docs[0];
        console.log(solution)

        return {
            id: solution.id,
            challengeId: solution.data().challenge_name,
            user: solution.data().user,
            testCaseResults: (
                await db.collection("Solution")
                    .doc(solution.id)
                    .collection("Result")
                    .doc("Result")
                    .collection("SubResults").get())
                .docs
                .map(d => d.data())
                .map(d => ({
                    points: d.points as number,
                    testCaseId: d.test_case_id as string,
                    memory: d.memory as number,
                    time: d.runtime as number
                }))
        }
    }

    async list(body: ListBody): Promise<ListReturned> {
        const db = getFirestore()
        let solutions = (await db.collection("Solution").get()).docs;
        console.log(solutions)
        let returned: ListReturned = solutions.map(d => ({
            id: d.id,
            challengeId: d.data().challenge_name,
            user: d.data().user,
            testCaseResults: []
        }));

        for (let i = 0; i < solutions.length; i++) {

            returned[i].testCaseResults = (
                await db.collection("Solution")
                    .doc(solutions[i].id)
                    .collection("Result")
                    .doc("Result")
                    .collection("SubResults").get())
                .docs
                .map(d => d.data())
                .map(d => ({
                    points: d.points as number,
                    testCaseId: d.test_case_id as string,
                    memory: d.memory as number,
                    time: d.runtime as number
                })
            );

        }

        return returned;

    }

}
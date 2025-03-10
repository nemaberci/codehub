import { Solution } from "../../client/returnedTypes";
import SolutionService from "../api/SolutionService";
import {BuildResultBody, ListBody, ResultBody, SolveBody} from "../types/EndpointInputTypes";
import FileHandlingClient from '../../client/FileHandlingClient';
import { decode } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PubSub } from "@google-cloud/pubsub";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {BuildResultReturned, ListReturned, ResultReturned} from "../types/EndpointReturnedTypes";

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
            body.authToken,
            folderName,
            body.folderContents
        );
        console.log("Uploaded folder contents to: ", folderName)
        let solutionId = "solution-" + randomUUID().toString();

        const SOLUTIONS_PER_DAY = 20;

        const userId = decode(body.authToken, {json: true})!.userId;
        const uploadedToday = (await db.collection("Solution")
            .where(
                "user",
                "==",
                userId
            )
            .where(
                "time_submitted",
                ">",
                new Date(new Date().setHours(0, 0, 0, 0))
            )
            .get()).docs.length;

        if (uploadedToday >= SOLUTIONS_PER_DAY) {
            throw new Error(`You have already uploaded ${SOLUTIONS_PER_DAY} solutions today`);
        }

        await db.collection("Solution").doc(solutionId).set({
            challenge_name: body.challengeId,
            entry_point: body.entryPoint ?? "Solution.java",
            time_submitted: new Date(),
            source_folder: folderName,
            user: userId,
            language: body.language,
        });
        console.log("Uploaded solution to firestore: ", solutionId);

        const pubsub = new PubSub();
        const topicName = "SolutionUploaded";

        // todo: normal language handling
        if (!["java", "cpp"].includes(body.language ?? "java")) {
            throw new Error("Language not supported");
        }

        await pubsub.topic(topicName).publishMessage(
            {
                attributes: {
                    sourceFolderName: folderName,
                    challengeId: body.challengeId,
                    entryPoint: body.entryPoint ?? "Solution.java",
                    solutionId: solutionId,
                    secretName: (process.env as any)["SECRET_FILE_NAME"],
                    imageName: `${body.language ?? 'java'}-builder`
                }
            }
        );
        console.log("Published message to pubsub topic: ", topicName);

        return {
            id: folderName,
            challengeId: body.challengeId,
            user: userId,
            testCaseResults: [],
            language: body.language ?? "java",
            files: body.folderContents
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
            .orderBy("time_submitted", "desc")
            .get())
            .docs[0];
        // console.log(solution)
        let fileHandlingClient = FileHandlingClient;
        const files = await fileHandlingClient.downloadFolderContent(
            body.authToken,
            solution.data().source_folder
        );

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
                })),
            language: solution.data().language,
            files: files
        }
    }

    async list(body: ListBody): Promise<ListReturned> {
        const db = getFirestore()
        let solutions = (await db.collection("Solution")
            .where(
                "challenge_name",
                "==",
                body.challengeId
            )
            .get()).docs;
        console.log(solutions)
        let returned: ListReturned = solutions.map(d => ({
            id: d.id,
            challengeId: d.data().challenge_name,
            user: d.data().user,
            testCaseResults: [],
            language: d.data().language,
            files: null
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

    async buildResult(body: BuildResultBody): Promise<BuildResultReturned> {
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
            .orderBy("time_submitted", "desc")
            .get())
            .docs[0];

        return {
            solutionId: solution.id,
            buildResult: solution.data().build_status,
            buildOutput: solution.data().build_output
        };
    }

}
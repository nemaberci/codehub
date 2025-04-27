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
        console.log("List function called with body:", JSON.stringify(body));
        
        const db = getFirestore();
        const currentUserId = decode(body.authToken, {json: true})!.userId;
        console.log("Current user ID:", currentUserId);

        // Check if challengeId is valid
        if (!body.challengeId || body.challengeId.trim() === '') {
            console.error("Challenge ID is missing or empty");
            throw new Error("Challenge ID is required");
        }
        console.log("Challenge ID:", body.challengeId);

        try {
            // Get challenge creator
            console.log("Attempting to fetch challenge document with ID:", body.challengeId);
            const challengeDoc = await db.collection("Challenge").doc(body.challengeId).get();
            console.log("Challenge document exists:", challengeDoc.exists);
            
            if (!challengeDoc.exists) {
                console.error("Challenge not found with ID:", body.challengeId);
                throw new Error("Challenge not found");
            }
            
            const challengeCreatorId = challengeDoc.data()?.created_by;
            console.log("Challenge creator ID:", challengeCreatorId);

            // If user is not the challenge creator, only show their own solutions
            console.log("Building query for solutions");
            const query = db.collection("Solution").where("challenge_name", "==", body.challengeId);
            if (currentUserId !== challengeCreatorId) {
                console.log("User is not the challenge creator, filtering by user ID");
                query.where("user", "==", currentUserId);
            }

            console.log("Executing query for solutions");
            let solutions = (await query.get()).docs;
            console.log("Found solutions count:", solutions.length);

            // Group solutions by user
            console.log("Grouping solutions by user");
            const userSolutions = new Map<string, any[]>();
            for (const doc of solutions) {
                const data = doc.data();
                const userId = data.user;
                console.log("Solution user ID:", userId);
                if (!userSolutions.has(userId)) {
                    userSolutions.set(userId, []);
                }
                userSolutions.get(userId)!.push(data);
            }
            console.log("User solutions map size:", userSolutions.size);

            // Calculate aggregated results for each user
            console.log("Calculating aggregated results");
            const results: ListReturned = [];
            for (const [userId, userDocs] of userSolutions) {
                console.log("Processing user:", userId);
                let maxPoints = 0;
                let maxMemory = 0;
                let bestLanguage = "";
                let bestSolutionId = "";

                // First pass: find the best solution
                for (const doc of userDocs) {
                    console.log("Checking solution:", doc.source_folder);
                    try {
                        const subResults = await db.collection("Solution")
                            .doc(doc.source_folder)
                            .collection("Result")
                            .doc("Result")
                            .collection("SubResults")
                            .get();
                        
                        console.log("SubResults count:", subResults.docs.length);
                        const points = subResults.docs.reduce((sum, d) => sum + (d.data().points as number), 0);
                        console.log("Solution points:", points);

                        if (points > maxPoints) {
                            maxPoints = points;
                            bestLanguage = doc.language;
                            bestSolutionId = doc.source_folder;
                            console.log("New best solution found:", bestSolutionId, "with points:", maxPoints);
                        }
                    } catch (error) {
                        console.error("Error processing solution:", doc.source_folder, error);
                    }
                }

                // Second pass: get memory from best solution only
                if (bestSolutionId) {
                    console.log("Getting memory from best solution:", bestSolutionId);
                    try {
                        const bestSolutionResults = await db.collection("Solution")
                            .doc(bestSolutionId)
                            .collection("Result")
                            .doc("Result")
                            .collection("SubResults")
                            .get();

                        maxMemory = Math.max(...bestSolutionResults.docs.map(d => d.data().memory as number));
                        console.log("Max memory:", maxMemory);
                    } catch (error) {
                        console.error("Error getting memory from best solution:", error);
                    }
                }

                // Fetch user information
                console.log("Fetching user information for:", userId);
                try {
                    const userDoc = await db.collection("User").doc(userId).get();
                    console.log("User document exists:", userDoc.exists);
                    
                    if (!userDoc.exists) {
                        console.warn(`User with ID ${userId} not found`);
                        continue;
                    }
                    
                    const userData = userDoc.data()!;
                    console.log("User data:", JSON.stringify(userData));

                    results.push({
                        user: {
                            id: userId,
                            username: userData.username
                        },
                        maxPoints,
                        maxMemory,
                        language: bestLanguage,
                        attempts: userDocs.length
                    });
                    console.log("Added user to results:", userId);
                } catch (error) {
                    console.error("Error fetching user information:", error);
                }
            }

            console.log("Returning results count:", results.length);
            return results;
        } catch (error) {
            console.error("Error in list function:", error);
            throw error;
        }
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
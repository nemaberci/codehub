import { Solution } from "../../client/returnedTypes";
import SolutionService from "../api/SolutionService";
import { SolveBody } from "../types/EndpointInputTypes";
import FileHandlingClient from '../../client/FileHandlingClient';
import { sign } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PubSub } from "@google-cloud/pubsub";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class SolutionImpl implements SolutionService {
    async solve(body: SolveBody): Promise<Solution> {

        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY, 
            "internal-keys", 
            "private2.pem"
        );
        console.log("Downloaded private key: ", file);
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        let token = sign({}, text, { expiresIn: "1h", algorithm: "RS256" });
        let folderName = "solution-source-" + randomUUID().toString();
        console.log("Generated token: ", token);
        await fileHandlingClient.uploadFolderContent(
            token,
            folderName,
            body.folderContents
        );
        console.log("Uploaded folder contents to: ", folderName)
        let solutionId = "solution-" + randomUUID().toString();

        const db = getFirestore();
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

        return {
            id: folderName
        };

    }

}
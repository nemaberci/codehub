import UserService from "../api/UserService";
import {LoginBody, RegisterBody} from "../types/EndpointInputTypes";
import {LoginReturned, RegisterReturned} from "../types/EndpointReturnedTypes";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import FileHandlingClient from "../../client/FileHandlingClient";
import {sign} from "jsonwebtoken";
import {pbkdf2Sync, randomBytes} from "crypto";

// initializeApp({
//     credential: applicationDefault()
// });
initializeApp();

export default class UserImpl implements UserService {
    async login(body: LoginBody): Promise<LoginReturned> {

        const db = getFirestore();
        let user = await db.collection("User").select("username", "passwordHash", "salt").where(
            "username",
            "==",
            body.username
        ).get();
        if (user.empty) {
            throw new Error("User not found");
        }
        let userData = user.docs[0].data();
        let salt = userData.salt;
        let passwordHash = userData.passwordHash;
        let hash = await pbkdf2Sync(body.password, salt, 1000, 64, 'sha512').toString('hex');
        if (hash !== passwordHash) {
            throw new Error("Password incorrect");
        }
        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY,
            "internal-keys",
            "private1.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        return sign({}, text, { expiresIn: "1h", algorithm: "RS256" });

    }

    async register(body: RegisterBody): Promise<RegisterReturned> {

        const db = getFirestore();
        let user = await db.collection("User").select("username", "passwordHash", "salt").where(
            "username",
            "==",
            body.username
        ).get();
        if (!user.empty) {
            throw new Error("User already exists");
        }
        let salt = randomBytes(128).toString('base64');
        let hash = await pbkdf2Sync(body.password, salt, 1000, 64, 'sha512').toString('hex');
        await db.collection("User").add({
            username: body.username,
            passwordHash: hash,
            salt: salt
        })
        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY,
            "internal-keys",
            "private1.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        return sign({}, text, { expiresIn: "1y", algorithm: "RS256" });

    }
}
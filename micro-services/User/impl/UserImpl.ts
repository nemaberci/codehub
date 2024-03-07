import UserService from "../api/UserService";
import {AddRolesBody, LoginBody, RegisterBody, RemoveRolesBody} from "../types/EndpointInputTypes";
import {AddRolesReturned, LoginReturned, RegisterReturned, RemoveRolesReturned} from "../types/EndpointReturnedTypes";
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
        return sign({
            userId: user.docs[0].id,
            roles: userData.roles
        }, text, { expiresIn: "1h", algorithm: "RS256" });

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
        let createdUser = await db.collection("User").add({
            username: body.username,
            passwordHash: hash,
            salt: salt,
            roles: ["challenge_reader", "solution_reader", "file_reader"]
        })
        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY,
            "internal-keys",
            "private1.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        return sign({
            userId: createdUser.id,
            roles: []
        }, text, { expiresIn: "1y", algorithm: "RS256" });

    }

    async addRoles(body: AddRolesBody): Promise<AddRolesReturned> {
        const db = getFirestore();
        let user = await db.collection("User").select("roles").where(
            "username",
            "==",
            body.username
        ).get();
        if (user.empty) {
            throw {
                message: "User not found",
                status: 404
            };
        }
        const rolesToAdd = body.roles.filter(role => !user.docs[0].data().roles.includes(role));
        if (rolesToAdd.length === 0) {
            return true;
        }
        await db.collection("User").doc(user.docs[0].id).update({
            roles: user.docs[0].data().roles.concat(rolesToAdd)
        })
        return true;
    }

    async removeRoles(body: RemoveRolesBody): Promise<RemoveRolesReturned> {
        const db = getFirestore();
        let user = await db.collection("User").select("roles").where(
            "username",
            "==",
            body.username
        ).get();
        if (user.empty) {
            throw {
                message: "User not found",
                status: 404
            };
        }
        const rolesToRemove = body.roles.filter(role => user.docs[0].data().roles.includes(role));
        if (rolesToRemove.length === 0) {
            return true;
        }
        await db.collection("User").doc(user.docs[0].id).update({
            roles: user.docs[0].data().roles.filter((role: string) => !rolesToRemove.includes(role))
        })
        return true;
    }

    async registerAdmin() {
        const db = getFirestore();
        let user = await db.collection("User").select("username", "passwordHash", "salt").where(
            "username",
            "==",
            "admin"
        ).get();
        let salt = randomBytes(128).toString('base64');
        let hash = await pbkdf2Sync("admin", salt, 1000, 64, 'sha512').toString('hex');
        if (!user.empty) {
            await db.collection("User").doc(user.docs[0].id).update({
                passwordHash: hash,
                salt: salt,
                roles: ["admin"]
            })
        } else {
            await db.collection("User").add({
                username: "admin",
                passwordHash: hash,
                salt: salt,
                roles: ["admin"]
            })
        }
    }

    constructor() {
        this.registerAdmin();
    }
}
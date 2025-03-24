import UserService from "../api/UserService";
import {AddRolesBody, LoginBody, RegisterBody, RemoveRolesBody} from "../types/EndpointInputTypes";
import {AddRolesReturned, LoginReturned, RegisterReturned, RemoveRolesReturned} from "../types/EndpointReturnedTypes";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import FileHandlingClient from "../../client/FileHandlingClient";
import {decode, JwtPayload, sign, verify} from "jsonwebtoken";
import {pbkdf2Sync, randomBytes} from "crypto";
import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";
import {Storage} from "@google-cloud/storage";
import {readFileSync} from "fs";
import { Express } from "express";
import passport from "./passport";

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
        if (process.env.TEST_MODE === "true") {
            const privateKey = readFileSync("../keys/private.pem");
            return sign({
                userId: user.docs[0].id,
                roles: userData.roles
            }, privateKey, {expiresIn: "1h", algorithm: "RS256"});
        } else {
            const client = new SecretManagerServiceClient();
            const privateKeyAccess = await client.accessSecretVersion({
                name: `projects/${process.env.PROJECT_ID ?? '656565803311'}/secrets/${process.env.SECRET_FILE_NAME ?? 'private_key.pem'}/versions/latest`
            })
            const privateKey = privateKeyAccess[0].payload?.data?.toString() ?? "";
            return sign({
                userId: user.docs[0].id,
                roles: userData.roles
            }, privateKey, {expiresIn: "1h", algorithm: "RS256"});
        }

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
        const client = new SecretManagerServiceClient();
        const privateKeyAccess = await client.accessSecretVersion({
            name: `projects/${process.env.PROJECT_ID ?? '656565803311'}/secrets/${process.env.SECRET_FILE_NAME ?? 'private_key.pem'}/versions/latest`
        })
        const privateKey = privateKeyAccess[0].payload?.data?.toString() ?? "";
        return sign({
            userId: createdUser.id,
            roles: []
        }, privateKey, {expiresIn: "1y", algorithm: "RS256"});

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

    async hasRoles(body: EndpointInputTypes.HasRolesBody): Promise<EndpointReturnedTypes.HasRolesReturned> {
        const db = getFirestore();

        const storage = new Storage();
        let publicKey: string;
        if (process.env.TEST_MODE === "true") {
            publicKey = readFileSync("../keys/public.pem").toString();
        } else {
            try {
                const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "codehub-public-keys");
                const file = await bucket.file(process.env.PUBLIC_KEY_FILENAME ?? 'public_key.pem').download();
                publicKey = file[0].toString();
            } catch (e) {
                console.error(e);
                throw {
                    message: "Error while downloading public key",
                    code: 500
                };
            }
        }
        const token = body.authToken;
        let payload = verify(token, publicKey) as JwtPayload;
        let user = await db.collection("User").doc(payload.userId).get();
        if (!user.exists) {
            throw {
                message: "User not found",
                status: 404
            };
        }
        const rolesOfUser = ((user.data()!.roles as (string[] | undefined | null)) ?? []);
        return body.roles.every(role => rolesOfUser.includes(role));
    }

    async byId(body: EndpointInputTypes.ByIdBody): Promise<EndpointReturnedTypes.ByIdReturned> {
        const db = getFirestore();

        let user = await db.collection("User").doc(body.userId).get();
        if (!user.exists) {
            throw {
                message: "User not found",
                status: 404
            };
        }

        return {
            username: user.data()!.username,
            id: user.id,
        };
    }

    constructor() {
        this.registerAdmin();
    }

    registerCustomCallbacks(app: Express) {
        console.log("Registered endpoint on '/user/auth/google'");
        app.get("/auth/google",
            passport.authenticate("google", {
                scope: ["email"],
                session: false
            })
        );
        console.log("Registered endpoint on '/user/auth/google/callback'");
        app.get("/auth/google/callback",
            passport.authenticate(
                "google",
                { session: false }
            ),
                (req, res) => {
                    const email = (((req.user as any)["emails"] as any[])[0] as any)["value"]
                    console.log(email)
                    // const { email } = req.user;
                    // Try to find user with this email address
                    // If not found, create new user
                    const db = getFirestore();
                    db.collection("User").select("username", "passwordHash", "salt").where(
                        "username",
                        "==",
                        email
                    ).get().then(
                        (user) => {
                            if (user.empty) {
                                let salt = randomBytes(256).toString('base64');
                                let hash = pbkdf2Sync(email, salt, 1000, 64, 'sha512').toString('hex');
                                db.collection("User").add({
                                    username: email,
                                    passwordHash: hash,
                                    salt: salt,
                                    roles: ["challenge_reader", "solution_reader", "file_reader"]
                                }).then(
                                    () =>{
                                        db.collection("User").select("username", "passwordHash", "salt").where(
                                            "username",
                                            "==",
                                            email
                                        ).get().then(
                                            actualUser => {
                                                const privateKey = readFileSync("../keys/private.pem");
                                                const token = sign({
                                                    userId: actualUser.docs[0].id,
                                                    roles: actualUser.docs[0].data().roles
                                                }, privateKey, {expiresIn: "1h", algorithm: "RS256"});
                                                res.redirect(`/auth/success?token=${token}`);
                                            }
                                        );
                                    }
                                )
                            } else {
                                const privateKey = readFileSync("../keys/private.pem");
                                const token = sign({
                                    userId: user.docs[0].id,
                                    roles: user.docs[0].data().roles
                                }, privateKey, {expiresIn: "1h", algorithm: "RS256"});
                                res.redirect(`/auth/success?token=${token}`);
                            }
                        }
                    );
                }
        );
    }
}
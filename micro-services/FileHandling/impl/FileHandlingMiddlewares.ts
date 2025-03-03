import {RequestHandler} from "express"
import {readFileSync, writeFileSync} from "fs";
import {Storage} from "@google-cloud/storage";
import {verify} from "jsonwebtoken";

export const userContentAccess: RequestHandler = async (req, res, next) => {
    next();
}

export const userUploadLimiter: RequestHandler = async (req, res, next) => {
    next();
}

const publicKeyName = process.env.PUBLIC_KEY_NAME ?? "public.pem";

export const keyAccess: RequestHandler = async (req, res, next) => {
    try {
        const storage = new Storage();
        const publicKeyDownload = await storage.bucket(process.env.PUBLIC_KEY_BUCKET_NAME ?? "public-keys")
            .file(publicKeyName)
            .download();
        const publicKey = publicKeyDownload[0].toString();
        const authorization = req.headers.authorization!.substring("Bearer ".length);
        const decoded = verify(authorization, publicKey);
        if (decoded) {
            next();
        } else {
            res.status(401).send("Unauthorized");
        }
    } catch (e) {
        console.error(e);
        res.status(401).send("Unauthorized");
    }
}
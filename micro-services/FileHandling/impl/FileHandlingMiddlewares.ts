import {RequestHandler} from "express"

export const userContentAccess: RequestHandler = async (req, res, next) => {
    next();
}

export const userUploadLimiter: RequestHandler = async (req, res, next) => {
    next();
}
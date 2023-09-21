import NotificationPublisherImpl from './impl/NotificationPublisherImpl'
import NotificationPublisherService from './api/NotificationPublisherService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload } from "jsonwebtoken";

const publicKey = readFileSync(process.env.PUBLIC_KEY_FILE_LOCATION ?? "keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: NotificationPublisherService = new NotificationPublisherImpl()

const userAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", publicKey, { complete: false });
    if (token && isJwtPayload(token)) {
      // todo
      next();
      return;
    }
    console.warn("No Authorization token, or invalid Authorization token");
  } catch (e: any) {
    // todo
    next();
    return;
    console.error(e);
    res.status(401).send(e.message ?? "Unauthorized");
  }
};

const app = express()
app.use(express.json())

app.listen(3000)
console.log("App started and listening on port 3000");
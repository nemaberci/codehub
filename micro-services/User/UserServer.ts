import UserImpl from './impl/UserImpl'
import UserService from './api/UserService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload, sign } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';

let internalPublicKey = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
let externalPublicKey = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: UserService = new UserImpl()

const userAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", externalPublicKey, { complete: false });
    if (token && isJwtPayload(token)) {
      // todo: check if user is allowed to access this endpoint
      next();
      return;
    } else {
      console.warn("No Authorization token, or invalid Authorization token");
    }
  } catch (e: any) {
    console.error(e);
    res.status(401).send(e.message ?? "Unauthorized");
  }
};

const internalAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", internalPublicKey, { complete: false });
    if (token) {
      next();
      return;
    } else {
      console.warn("No Authorization token, or invalid Authorization token");
    }
  } catch (e: any) {
    console.error(e);
    res.status(401).send(e.message ?? "Unauthorized");
  }
};

const loadInternalKey: () => Promise<void> = async () => {
    try {
        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY, 
            (process.env as any).PUBLIC_KEY_BUCKET ?? "internal-keys",
            (process.env as any).PUBLIC_KEY_LOCATION ?? "public2.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        internalPublicKey = text;
    } catch (e) {
        console.warn(e);
    }
}

loadInternalKey();


const app = express()
app.use(express.json())
console.log("Registered endpoint on '/user/by_email_address/'");
app.get('/user/by_email_address/',
  (req, res, next) => {
    console.log("Call to '/user/by_email_address/'");
    next();
  },
  userAuthMiddleware,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.byEmailAddress(
        {
          ...req.body,
          authToken: req.headers.authorization!.substring("Bearer ".length)
        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/user/from_google_auth_token/'");
app.get('/user/from_google_auth_token/',
  (req, res, next) => {
    console.log("Call to '/user/from_google_auth_token/'");
    next();
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.fromGoogleAuthToken(
        {
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)

app.listen(parseInt(process.env.PORT ?? '3000'))
console.log(`App started and listening on port ${process.env.PORT ?? 3000}`);
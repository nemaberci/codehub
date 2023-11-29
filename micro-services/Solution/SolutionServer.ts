import SolutionImpl from './impl/SolutionImpl'
import SolutionService from './api/SolutionService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload, sign } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';

let internalPublicKey: string;
let externalPublicKey: string;

async function initKeys() {
  try {

    let fileHandlingClient = FileHandlingClient;
    let file = await fileHandlingClient.downloadFile(
      (process.env as any).FILE_HANDLING_API_KEY, 
      "internal-keys", 
      "private2.pem"
    );
    let buff = Buffer.from(file.content, 'base64');
    let text = buff.toString('ascii');
    console.log(sign({}, text, { expiresIn: "1h", algorithm: "RS256" }));

  } catch (e) {
    console.warn("Could not get private key from secret manager, falling back to file");
    console.warn(e);

    internalPublicKey = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
    externalPublicKey = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

  }

}

initKeys();

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: SolutionService = new SolutionImpl()

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

const app = express()
app.use(express.json())
console.log("Registered endpoint on '/solution/solve/'");
app.post('/solution/solve/',
  (req, res, next) => {
    console.log("Call to '/solution/solve/'");
    next();
  },
  userAuthMiddleware,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.solve(
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

app.listen(parseInt(process.env.PORT ?? '3001'))
console.log(`App started and listening on port ${process.env.PORT ?? 3001}`);
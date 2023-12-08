import ChallengeImpl from './impl/ChallengeImpl'
import ChallengeService from './api/ChallengeService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload, sign } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';
import cors from 'cors'

let internalPublicKey: string // = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
let externalPublicKey: string // = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: ChallengeService = new ChallengeImpl()

const userAuthMiddleware: RequestHandler = async (req, res, next) => {
  /*try {
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", externalPublicKey, { complete: false });
    if (token) {
      // todo: check if user is allowed to access this endpoint
      next();
      return;
    } else {
      console.warn("No Authorization token, or invalid Authorization token");
      res.status(401).send("Unauthorized");
    }
  } catch (e: any) {
    console.error(e);
    res.status(401).send(e.message ?? "Unauthorized");
  }*/
  next();
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
      console.log((process.env as any).FILE_HANDLING_API_KEY)
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

const loadExternalKey: () => Promise<void> = async () => {
    try {
      console.log((process.env as any).FILE_HANDLING_API_KEY)
        let fileHandlingClient = FileHandlingClient;
        let file = await fileHandlingClient.downloadFile(
            (process.env as any).FILE_HANDLING_API_KEY, 
            (process.env as any).PUBLIC_KEY_BUCKET ?? "internal-keys",
            (process.env as any).PUBLIC_KEY_LOCATION ?? "public1.pem"
        );
        let buff = Buffer.from(file.content, 'base64');
        let text = buff.toString('ascii');
        externalPublicKey = text;
    } catch (e) {
        console.warn(e);
    }
}

loadExternalKey();


const app = express()
app.use(cors())
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

console.log("Registered endpoint on '/challenge/upload/'");
app.post('/challenge/upload/',
  (req, res, next) => {
    console.log("Call to '/challenge/upload/'");
    next();
  },
  userAuthMiddleware,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.upload(
        {
          ...req.body,
          //authToken: req.headers.authorization?.substring("Bearer ".length) ?? ""
        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/challenge/add_test_cases/:challenge_id/'");
app.post('/challenge/add_test_cases/:challenge_id/',
  (req, res, next) => {
    console.log("Call to '/challenge/add_test_cases/:challenge_id/'");
    next();
  },
  userAuthMiddleware,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.addTestCases(
        {
          challengeId: req.params.challenge_id,
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
console.log("Registered endpoint on '/challenge/add_control_solution/:challenge_id/'");
app.post('/challenge/add_control_solution/:challenge_id/',
  (req, res, next) => {
    console.log("Call to '/challenge/add_control_solution/:challenge_id/'");
    next();
  },
  userAuthMiddleware,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.addControlSolution(
        {
          challengeId: req.params.challenge_id,
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

app.listen(parseInt(process.env.PORT ?? '3002'))
console.log(`App started and listening on port ${process.env.PORT ?? 3002}`);
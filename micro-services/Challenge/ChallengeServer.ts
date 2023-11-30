import ChallengeImpl from './impl/ChallengeImpl'
import ChallengeService from './api/ChallengeService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload } from "jsonwebtoken";

const internalPublicKey = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
const externalPublicKey = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: ChallengeService = new ChallengeImpl()

const userAuthMiddleware: RequestHandler = async (req, res, next) => {
  /*try {
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

const app = express()
app.use(express.json())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.listen(parseInt(process.env.PORT ?? '3000'))
console.log(`App started and listening on port ${process.env.PORT ?? 3000}`);
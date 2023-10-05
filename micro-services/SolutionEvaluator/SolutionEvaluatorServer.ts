import SolutionEvaluatorImpl from './impl/SolutionEvaluatorImpl'
import SolutionEvaluatorService from './api/SolutionEvaluatorService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload } from "jsonwebtoken";

const internalPublicKey = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
const externalPublicKey = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: SolutionEvaluatorService = new SolutionEvaluatorImpl()

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

app.listen(parseInt(process.env.PORT ?? '3000'))
console.log(`App started and listening on port ${process.env.PORT ?? 3000}`);
import UserImpl from './impl/UserImpl'
import UserService from './api/UserService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload } from "jsonwebtoken";

const publicKey = readFileSync(process.env.PUBLIC_KEY_FILE_LOCATION ?? "keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: UserService = new UserImpl()

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
console.log("Registered endpoint on '/user/by_email_address'");
app.get('/user/by_email_address',
  (req, res, next) => {
    console.log("Call to '/user/by_email_address'");
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

app.listen(parseInt(process.env.PORT ?? '3000'))
console.log(`App started and listening on port ${process.env.PORT ?? 3000}`);
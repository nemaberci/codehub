import UserImpl from './impl/UserImpl'
import UserService from './api/UserService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload, sign } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';

let internalPublicKey: string // = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
let externalPublicKey: string // = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'roles' in (token as JwtPayload);
}

const serviceImpl: UserService = new UserImpl()

const userAuthMiddleware: RequestHandler = async (req, res, next) => {
  try {
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

const loadExternalKey: () => Promise<void> = async () => {
    try {
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
app.use(express.json())
console.log("Registered endpoint on '/user/login/'");
app.post('/user/login/',
  (req, res, next) => {
    console.log("Call to '/user/login/'");
    next();
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.login(
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
console.log("Registered endpoint on '/user/register/'");
app.post('/user/register/',
  (req, res, next) => {
    console.log("Call to '/user/register/'");
    next();
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.register(
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
console.log("Registered endpoint on '/user/add_roles/:username/'");
app.post('/user/add_roles/:username/',
  (req, res, next) => {
    console.log("Call to '/user/add_roles/:username/'");
    next();
  },
  userAuthMiddleware,
  (req, res, next) => {
    if (req.headers.authorization?.substring("Bearer ".length) === undefined) {
      res.status(401).send("Unauthorized");
      return;
    }
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", internalPublicKey, { complete: false });
    if (token && isJwtPayload(token)) {
      if (token.roles.includes("admin") || token.roles.includes("admin")) {
        next();
        return;
      }
    }
    res.status(401).send("Unauthorized");
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.addRoles(
        {
          username: req.params.username,
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
console.log("Registered endpoint on '/user/remove_roles/:username/'");
app.post('/user/remove_roles/:username/',
  (req, res, next) => {
    console.log("Call to '/user/remove_roles/:username/'");
    next();
  },
  userAuthMiddleware,
  (req, res, next) => {
    if (req.headers.authorization?.substring("Bearer ".length) === undefined) {
      res.status(401).send("Unauthorized");
      return;
    }
    let token = verify(req.headers.authorization?.substring("Bearer ".length) ?? "", internalPublicKey, { complete: false });
    if (token && isJwtPayload(token)) {
      if (token.roles.includes("admin") || token.roles.includes("admin")) {
        next();
        return;
      }
    }
    res.status(401).send("Unauthorized");
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.removeRoles(
        {
          username: req.params.username,
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
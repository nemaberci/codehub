import SolutionImpl from './impl/SolutionImpl'
import SolutionService from './api/SolutionService'
import express, { RequestHandler } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { verify, JwtPayload, sign, decode } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';
import UserClient from '../client/UserClient';
import { randomBytes } from "crypto";

const serviceImpl: SolutionService = new SolutionImpl()

const app = express()
app.use(express.json())
console.log("Registered endpoint on '/solution/solve/'");
app.post('/solution/solve/',
  (req, res, next) => {
    console.log("Call to '/solution/solve/'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["solution_writer",];
    let userClient = UserClient;
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
      return;
    }
    let hasRoles = await userClient.hasRoles(
      req.headers.authorization!.substring("Bearer ".length),
      requiredRoles
    );
    if (hasRoles) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  },
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
console.log("Registered endpoint on '/solution/list/:challenge_id'");
app.get('/solution/list/:challenge_id',
  (req, res, next) => {
    console.log("Call to '/solution/list/:challenge_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["solution_reader",];
    let userClient = UserClient;
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
      return;
    }
    let hasRoles = await userClient.hasRoles(
      req.headers.authorization!.substring("Bearer ".length),
      requiredRoles
    );
    if (hasRoles) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.list(
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
console.log("Registered endpoint on '/solution/result/:challenge_id/:user_id'");
app.get('/solution/result/:challenge_id/:user_id',
  (req, res, next) => {
    console.log("Call to '/solution/result/:challenge_id/:user_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["solution_reader",];
    let userClient = UserClient;
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
      return;
    }
    let hasRoles = await userClient.hasRoles(
      req.headers.authorization!.substring("Bearer ".length),
      requiredRoles
    );
    if (hasRoles) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.result(
        {
          challengeId: req.params.challenge_id,
          userId: req.params.user_id,
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
console.log("Registered endpoint on '/solution/build_result/:challenge_id/:user_id'");
app.get('/solution/build_result/:challenge_id/:user_id',
  (req, res, next) => {
    console.log("Call to '/solution/build_result/:challenge_id/:user_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["solution_reader",];
    let userClient = UserClient;
    if (!req.headers.authorization) {
      res.status(401).send("Unauthorized");
      return;
    }
    let hasRoles = await userClient.hasRoles(
      req.headers.authorization!.substring("Bearer ".length),
      requiredRoles
    );
    if (hasRoles) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.buildResult(
        {
          challengeId: req.params.challenge_id,
          userId: req.params.user_id,
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
if (process.env.TEST_MODE) {
  console.log("Test mode enabled");
}
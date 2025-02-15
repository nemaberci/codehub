import ChallengeImpl from './impl/ChallengeImpl'
import ChallengeService from './api/ChallengeService'
import express, { RequestHandler } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { verify, JwtPayload, sign, decode } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';
import UserClient from '../client/UserClient';
import { randomBytes } from "crypto";

const serviceImpl: ChallengeService = new ChallengeImpl()

const app = express()
app.use(express.json())
console.log("Registered endpoint on '/challenge/upload/'");
app.post('/challenge/upload/',
  (req, res, next) => {
    console.log("Call to '/challenge/upload/'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_writer",];
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
      let answer = await serviceImpl.upload(
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
console.log("Registered endpoint on '/challenge/add_test_cases/:challenge_id'");
app.post('/challenge/add_test_cases/:challenge_id',
  (req, res, next) => {
    console.log("Call to '/challenge/add_test_cases/:challenge_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_writer",];
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
console.log("Registered endpoint on '/challenge/add_control_solution/:challenge_id'");
app.post('/challenge/add_control_solution/:challenge_id',
  (req, res, next) => {
    console.log("Call to '/challenge/add_control_solution/:challenge_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_writer",];
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
console.log("Registered endpoint on '/challenge/get/:challenge_id'");
app.get('/challenge/get/:challenge_id',
  (req, res, next) => {
    console.log("Call to '/challenge/get/:challenge_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_reader",];
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
      let answer = await serviceImpl.get(
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
console.log("Registered endpoint on '/challenge/list/'");
app.get('/challenge/list/',
  (req, res, next) => {
    console.log("Call to '/challenge/list/'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_reader",];
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
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/challenge/list_by_user/:user_id'");
app.get('/challenge/list_by_user/:user_id',
  (req, res, next) => {
    console.log("Call to '/challenge/list_by_user/:user_id'");
    next();
  },
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["challenge_reader",];
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
      let answer = await serviceImpl.listByUser(
        {
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
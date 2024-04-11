import UserImpl from './impl/UserImpl'
import UserService from './api/UserService'
import express, { RequestHandler } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { verify, JwtPayload, sign, decode } from "jsonwebtoken";
import FileHandlingClient from '../client/FileHandlingClient';
import UserClient from '../client/UserClient';
import { randomBytes } from "crypto";

const serviceImpl: UserService = new UserImpl()

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
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["admin",];
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
      let answer = await serviceImpl.addRoles(
        {
          username: req.params.username,
          ...req.body        }
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
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["admin",];
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
      let answer = await serviceImpl.removeRoles(
        {
          username: req.params.username,
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/user/has_roles/'");
app.get('/user/has_roles/',
  (req, res, next) => {
    console.log("Call to '/user/has_roles/'");
    next();
  },
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.hasRoles(
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
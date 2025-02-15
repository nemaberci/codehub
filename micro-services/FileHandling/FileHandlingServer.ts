import FileHandlingImpl from './impl/FileHandlingImpl'
import FileHandlingService from './api/FileHandlingService'
import express, { RequestHandler } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { verify, JwtPayload, sign, decode } from "jsonwebtoken";
import { userContentAccess, userUploadLimiter, keyAccess,  } from "./impl/FileHandlingMiddlewares"
import UserClient from '../client/UserClient';
import { randomBytes } from "crypto";

const serviceImpl: FileHandlingService = new FileHandlingImpl()

const app = express()
app.use(express.json())
console.log("Registered endpoint on '/file_handling/upload_folder_content/:folder_name'");
app.post('/file_handling/upload_folder_content/:folder_name',
  (req, res, next) => {
    console.log("Call to '/file_handling/upload_folder_content/:folder_name'");
    next();
  },
  userContentAccess,
  userUploadLimiter,
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["file_writer",];
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
      let answer = await serviceImpl.uploadFolderContent(
        {
          folderName: req.params.folder_name,
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/file_handling/download_folder_content/:folder_name'");
app.get('/file_handling/download_folder_content/:folder_name',
  (req, res, next) => {
    console.log("Call to '/file_handling/download_folder_content/:folder_name'");
    next();
  },
  userContentAccess,
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["file_reader",];
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
      let answer = await serviceImpl.downloadFolderContent(
        {
          folderName: req.params.folder_name,
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/file_handling/download_file/:file_name(*)'");
app.get('/file_handling/download_file/:file_name(*)',
  (req, res, next) => {
    console.log("Call to '/file_handling/download_file/:file_name(*)'");
    next();
  },
  userContentAccess,
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["file_reader",];
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
      let answer = await serviceImpl.downloadFile(
        {
          fileName: req.params.file_name,
          ...req.body        }
      );
      res.status(200).send(answer);
    } catch (e: any) {
      res.status(e.status ?? 500).send(typeof e.message === "string" ? `["${e.message}"]` : e.message);
    }
    res.end();
  }
)
console.log("Registered endpoint on '/file_handling/delete_folder/:folder_name'");
app.delete('/file_handling/delete_folder/:folder_name',
  (req, res, next) => {
    console.log("Call to '/file_handling/delete_folder/:folder_name'");
    next();
  },
  userContentAccess,
  async (req, res, next) => {
    const payload = decode(req.headers.authorization!) as JwtPayload;
    let requiredRoles = ["file_writer",];
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
      let answer = await serviceImpl.deleteFolder(
        {
          folderName: req.params.folder_name,
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
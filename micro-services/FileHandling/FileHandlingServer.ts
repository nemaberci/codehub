import FileHandlingImpl from './impl/FileHandlingImpl'
import FileHandlingService from './api/FileHandlingService'
import express, { RequestHandler } from 'express'
import { readFileSync } from 'fs'
import { verify, JwtPayload } from "jsonwebtoken";
import { userContentAccess, userUploadLimiter,  } from "./impl/FileHandlingMiddlewares"

const internalPublicKey = readFileSync(process.env.INTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/internalPublic.pem").toString()
const externalPublicKey = readFileSync(process.env.EXTERNAL_PUBLIC_KEY_FILE_LOCATION ?? "../keys/public.pem").toString()

const isJwtPayload = (token: string | JwtPayload): token is JwtPayload => {
  return 'sub' in (token as JwtPayload);
}

const serviceImpl: FileHandlingService = new FileHandlingImpl()

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
console.log("Registered endpoint on '/file_handling/upload_folder_content/:folder_name/'");
app.post('/file_handling/upload_folder_content/:folder_name/',
  (req, res, next) => {
    console.log("Call to '/file_handling/upload_folder_content/:folder_name/'");
    next();
  },
  internalAuthMiddleware,
  userContentAccess,
  userUploadLimiter,
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
console.log("Registered endpoint on '/file_handling/download_folder_content/:folder_name/'");
app.get('/file_handling/download_folder_content/:folder_name/',
  (req, res, next) => {
    console.log("Call to '/file_handling/download_folder_content/:folder_name/'");
    next();
  },
  internalAuthMiddleware,
  userContentAccess,
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
console.log("Registered endpoint on '/file_handling/download_file/:bucket_name/:file_name/'");
app.get('/file_handling/download_file/:bucket_name/:file_name/',
  (req, res, next) => {
    console.log("Call to '/file_handling/download_file/:bucket_name/:file_name/'");
    next();
  },
  internalAuthMiddleware,
  userContentAccess,
  async (req, res, next) => {
    try {
      let answer = await serviceImpl.downloadFile(
        {
          bucketName: req.params.bucket_name,
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
console.log("Registered endpoint on '/file_handling/delete_folder/:folder_name/'");
app.delete('/file_handling/delete_folder/:folder_name/',
  (req, res, next) => {
    console.log("Call to '/file_handling/delete_folder/:folder_name/'");
    next();
  },
  internalAuthMiddleware,
  userContentAccess,
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
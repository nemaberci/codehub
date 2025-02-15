import {File} from "../../client/returnedTypes";
import FileHandlingService from "../api/FileHandlingService";
import {
    DeleteFolderBody,
    DownloadFileBody,
    DownloadFolderContentBody,
    UploadFolderContentBody
} from "../types/EndpointInputTypes";
import {Storage} from "@google-cloud/storage";


export default class FileHandlingImpl implements FileHandlingService {
    async downloadFile(body: DownloadFileBody): Promise<File> {
        if (body.fileName.endsWith("/") || body.fileName.endsWith("\\")) {
            body.fileName = body.fileName.substring(0, body.fileName.length - 1)
        }
        const storage = new Storage();
        try {
            const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources");
            const file = await bucket.file(body.fileName).download();
            return {
                content: file[0].toString('base64'),
                name: body.fileName
            };
        } catch (e) {
            console.error(e);
            throw {
                message: "Error while downloading files",
                code: 500
            };
        }
    }
    async uploadFolderContent(body: UploadFolderContentBody): Promise<any> {
        const storage = new Storage();
        const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources");
        let promises: Promise<boolean>[] = []
        console.log(body)
        body.files.forEach(file => {
            const fileName = `${body.folderName}/${file.name}`;
            promises.push(
                new Promise(
                    (resolve, reject) => {
                        const buff = Buffer.from(file.content, 'base64');
                        bucket.file(fileName).save(
                            buff
                        ).then(
                            () => resolve(true)
                        ).catch(
                            (err) => {
                                console.error(err);
                                reject(err)
                            }
                        )
                    }
                )
            )
        })
        try {
            await Promise.all(promises);
            return true;
        } catch (e) {
            console.error(e);
            throw {
                message: "Error while uploading files",
                code: 500
            };
        }
    }

    async downloadFolderContent(body: DownloadFolderContentBody): Promise<File[]> {
        const storage = new Storage();
        const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources");
        console.log("Downloading files in folder: ", `${process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources"}/${body.folderName}`)
        let promises: Promise<File>[] = []
        const files = await bucket.getFiles(
            {
                prefix: `${body.folderName}/`
            }
        )
        for (const file of files[0].filter(f => f.name.length > `${body.folderName}/`.length)) {
            console.log("File in folder: ", file.name)
            promises.push(
                new Promise(
                    (resolve, reject) => {
                        file.download().then(
                            fileContents => {
                                console.log(fileContents[0].toString())
                                resolve({
                                    content: fileContents[0].toString('base64'),
                                    name: file.name
                                })
                            }
                        ).catch(
                            err => {
                                console.error(err);
                                reject(err);
                            }
                        )
                    }
                )
            )

        }
        try {
            const transformedFiles = await Promise.all(promises)
            console.log(transformedFiles)
            return transformedFiles;
        } catch (e) {
            throw {
                message: "Error while downloading files",
                code: 500
            };
        }
    }

    deleteFolder(body: DeleteFolderBody): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
import {File} from "../../client/returnedTypes";
import FileHandlingService from "../api/FileHandlingService";
import {DeleteFolderBody, DownloadFolderContentBody, UploadFolderContentBody} from "../types/EndpointInputTypes";
import {Storage} from "@google-cloud/storage";

export default class FileHandlingImpl implements FileHandlingService {
    async uploadFolderContent(body: UploadFolderContentBody): Promise<any> {
        const storage = new Storage();
        const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources");
        let promises: Promise<boolean>[] = []
        body.files.forEach(file => {
            const fileName = `${body.folderName}/${file.name}`;
            promises.push(
                new Promise(
                    (resolve, reject) => {
                        const buff = Buffer.from(file.content, 'base64');
                        bucket.file(fileName).save(
                            buff.toString('binary')
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
            throw {
                message: "Error while uploading files",
                code: 500
            };
        }
    }

    async downloadFolderContent(body: DownloadFolderContentBody): Promise<File[]> {
        const storage = new Storage();
        const bucket = storage.bucket(process.env.STORAGE_BUCKET_NAME ?? "code-hub-sources");
        let promises: Promise<File>[] = []
        const files = await bucket.getFiles(
            {
                prefix: body.folderName,
                delimiter: '/'
            }
        )
        for (const file of files[0]) {
            promises.push(
                new Promise(
                    (resolve, reject) => {
                        file.download().then(
                            fileContents => {
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
            const files = await Promise.all(promises);
            return files;
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
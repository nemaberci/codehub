import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Tools for uploading, listing and downloading files. Users can only operate on their own files and folders.
*/
class FileHandlingClient {
    static async uploadFolderContent(
        
        authToken: string,
        folderName: string,
        files: inputValueModel.File[],
    ): Promise<boolean> {
        const url = (process.env as any).FILE_HANDLING_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).FILE_HANDLING_PORT ?? '3000'),
                    path: `/file_handling/upload_folder_content/${ folderName }/`,
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: false
                }, (res) => {
                res.setEncoding('utf8');
                let responseBody = '';
            
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
            
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
        
            req.on('error', (err) => {
                reject(err);
            });
        
            req.write(JSON.stringify({
                files
            }));
            req.end();
        });
    }
    static async downloadFolderContent(
        
        authToken: string,
        folderName: string
    ): Promise<returnValueModel.File[]> {
        const url = (process.env as any).FILE_HANDLING_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).FILE_HANDLING_PORT ?? '3000'),
                    path: `/file_handling/download_folder_content/${ folderName }/`,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: false
                }, (res) => {
                res.setEncoding('utf8');
                let responseBody = '';
            
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
            
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
        
            req.on('error', (err) => {
                reject(err);
            });
        
            req.end();
        });
    }
    static async downloadFile(
        
        authToken: string,
        bucketName: string,fileName: string
    ): Promise<returnValueModel.File> {
        const url = (process.env as any).FILE_HANDLING_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).FILE_HANDLING_PORT ?? '3000'),
                    path: `/file_handling/download_file/${ bucketName }/${ fileName }/`,
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: false
                }, (res) => {
                res.setEncoding('utf8');
                let responseBody = '';
            
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
            
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
        
            req.on('error', (err) => {
                reject(err);
            });
        
            req.end();
        });
    }
    static async deleteFolder(
        
        authToken: string,
        folderName: string
    ): Promise<boolean> {
        const url = (process.env as any).FILE_HANDLING_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).FILE_HANDLING_PORT ?? '3000'),
                    path: `/file_handling/delete_folder/${ folderName }/`,
                    method: "DELETE",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    agent: false
                }, (res) => {
                res.setEncoding('utf8');
                let responseBody = '';
            
                res.on('data', (chunk) => {
                    responseBody += chunk;
                });
            
                res.on('end', () => {
                    resolve(JSON.parse(responseBody));
                });
            });
        
            req.on('error', (err) => {
                reject(err);
            });
        
            req.end();
        });
    }
}

export default FileHandlingClient
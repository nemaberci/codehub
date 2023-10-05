const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Tools for uploading, listing and downloading files. Users can only operate on their own files and folders.
*/
class FileHandlingClient {
    static async uploadFolderContent(
        
        files: inputValueModel.File[]
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: '/file_handling/upload_folder_content',
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
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
        
            req.write({
                files
            });
            req.end();
        });
    }
    static async downloadFolderContent(
        
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: '/file_handling/download_folder_content',
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
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
        
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: '/file_handling/delete_folder',
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
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
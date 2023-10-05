const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Compiles java source code
*/
class JavaCodeCompilerClient {
    static async compile(
        
        authToken: string
        
        ,inputFolderName: string
        ,entryPoint: string
        ,outputFolderName: string
        ,maxTime: number
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/java_code_compiler/compile/`,
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
        
            req.write({
                inputFolderName,
                entryPoint,
                outputFolderName,
                maxTime
            });
            req.end();
        });
    }
}

export default JavaCodeCompilerClient
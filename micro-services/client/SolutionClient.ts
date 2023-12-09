import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles solutions that are submitted to challenges
*/
class SolutionClient {
    static async solve(
        authToken: string,
        
        
        challengeId: string,
        folderContents: inputValueModel.File[],
        entryPoint?: string,
    ): Promise<returnValueModel.Solution> {
        const url = (process.env as any).SOLUTION_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).SOLUTION_PORT ?? '3000'),
                    path: `/solution/solve/`,
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
                challengeId,
                folderContents,
                entryPoint
            }));
            req.end();
        });
    }
}

export default SolutionClient
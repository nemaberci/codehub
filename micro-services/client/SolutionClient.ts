const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles solutions that are submitted to challenges
*/
class SolutionClient {
    static async solve(
        authToken: string
        
        
        ,challengeId: string
        ,solutionSource: inputValueModel.SolutionSource
    ): Promise<returnValueModel.Solution> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
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
        
            req.write({
                challengeId,
                solutionSource
            });
            req.end();
        });
    }
}

export default SolutionClient
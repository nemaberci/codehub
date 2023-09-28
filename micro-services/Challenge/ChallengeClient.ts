const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "../client/returnedTypes";
import * as inputValueModel from "../client/inputTypes";

/** 
* @description Stores and handles challenges
*/
class ChallengeClient {
    static async upload(
        authToken: string,
        name: string,
        description: string,
        controlSolutions: inputValueModel.SolutionSource[],
        testCases: inputValueModel.TestCase[],
        outputVerifierLocation?: string
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: '/challenge/upload',
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
                name,
                description,
                controlSolutions,
                testCases,
                outputVerifierLocation
            });
            req.end();
        });
    }
}

export default ChallengeClient
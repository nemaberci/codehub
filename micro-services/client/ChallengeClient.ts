const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles challenges
*/
class ChallengeClient {
    static async upload(
        authToken: string,
        
        
        name: string,
        description: string,
        shortDescription: string,
        controlSolution?: inputValueModel.SolutionSource,
        testCases?: inputValueModel.TestCase[],
        outputVerifier?: inputValueModel.File,
    ): Promise<returnValueModel.Challenge> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/challenge/upload/`,
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
                name,
                description,
                shortDescription,
                controlSolution,
                testCases,
                outputVerifier
            }));
            req.end();
        });
    }
    static async addTestCases(
        authToken: string,
        
        challengeId: string,
        testCases: inputValueModel.TestCase[],
        outputVerifier: inputValueModel.File,
    ): Promise<returnValueModel.Challenge> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/challenge/add_test_cases/${ challengeId }/`,
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
                testCases,
                outputVerifier
            }));
            req.end();
        });
    }
    static async addControlSolution(
        authToken: string,
        
        challengeId: string,
        controlSolution: inputValueModel.SolutionSource,
    ): Promise<returnValueModel.Challenge> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/challenge/add_control_solution/${ challengeId }/`,
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
                controlSolution
            }));
            req.end();
        });
    }
}

export default ChallengeClient
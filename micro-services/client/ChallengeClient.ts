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
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
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
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
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
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
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
    static async get(
        authToken: string,
        
        challengeId: string
    ): Promise<returnValueModel.Challenge> {
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
                    path: `/challenge/get/${ challengeId }/`,
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
    static async list(
        authToken: string
        
        
    ): Promise<returnValueModel.Challenge[]> {
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
                    path: `/challenge/list/`,
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
    static async listByUser(
        authToken: string,
        
        userId: string
    ): Promise<returnValueModel.Challenge[]> {
        const url = (process.env as any).CHALLENGE_URL ?? "127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: parseInt((process.env as any).CHALLENGE_PORT ?? '3000'),
                    path: `/challenge/list_by_user/${ userId }/`,
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
}

export default ChallengeClient
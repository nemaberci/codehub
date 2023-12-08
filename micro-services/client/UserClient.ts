const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles users from external or internal sources
*/
class UserClient {
    static async login(
        
        
        
        username: string,
        password: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/user/login/`,
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
        
            req.write(JSON.stringify({
                username,
                password
            }));
            req.end();
        });
    }
    static async register(
        
        
        
        username: string,
        password: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: `/user/register/`,
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
        
            req.write(JSON.stringify({
                username,
                password
            }));
            req.end();
        });
    }
}

export default UserClient
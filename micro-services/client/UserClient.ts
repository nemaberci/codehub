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
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/login/`,
                {
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
    static async byId(
        authToken: string,
        
        userId: string
    ): Promise<returnValueModel.User> {
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/by_id/${ userId }/`,
                {
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
    static async register(
        
        
        
        username: string,
        password: string,
    ): Promise<string> {
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/register/`,
                {
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
    static async addRoles(
        authToken: string,
        
        username: string,
        roles: string[],
    ): Promise<boolean> {
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/add_roles/${ username }/`,
                {
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
                roles
            }));
            req.end();
        });
    }
    static async removeRoles(
        authToken: string,
        
        username: string,
        roles: string[],
    ): Promise<boolean> {
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/remove_roles/${ username }/`,
                {
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
                roles
            }));
            req.end();
        });
    }
    static async hasRoles(
        
        authToken: string,
        
        roles: string[],
    ): Promise<boolean> {
        const url = (process.env as any).USER_URL ?? "http://127.0.0.1";
        return new Promise((resolve, reject) => {
            const req = http.request(
                `${url}:${(process.env as any).USER_PORT ?? '3003'}/user/has_roles/`,
                {
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
        
            req.write(JSON.stringify({
                roles
            }));
            req.end();
        });
    }
}

export default UserClient
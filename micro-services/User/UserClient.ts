const url = "127.0.0.1";
import http from "node:http";

import * as returnValueModel from "../client/returnedTypes";
import * as inputValueModel from "../client/inputTypes";

/** 
* @description Stores and handles users from external or internal sources
*/
class UserClient {
    static async byEmailAddress(
        authToken: string,
        emailAddress: string
    ) {
        return new Promise((resolve, reject) => {
            const req = http.request(
                {
                    hostname: url,
                    port: 3000,
                    path: '/user/by_email_address',
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
                emailAddress
            });
            req.end();
        });
    }
}

export default UserClient
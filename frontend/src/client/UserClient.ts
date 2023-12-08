let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles users from external or internal sources
*/
class UserClient {
    static async login(
        username: string,
        password: string
    ): Promise<> {
        const answer = await fetch(
            `${url}/user/login`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        username, 
                        password, 
                    }
                )
            }
        );
        return await answer.json();
    }
    static async register(
        username: string,
        password: string
    ): Promise<> {
        const answer = await fetch(
            `${url}/user/register`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        username, 
                        password, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default UserClient;
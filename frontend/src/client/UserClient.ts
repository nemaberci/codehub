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
    static async byEmailAddress(
        authToken: string,
        emailAddress: string
    ): Promise<returnValueModel.User> {
        const answer = await fetch(
            `${url}/user/by_email_address`,
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                method: "GET",
                body: JSON.stringify(
                    {
                        emailAddress, 
                    }
                )
            }
        );
        return await answer.json();
    }
    static async fromGoogleAuthToken(
        token: string
    ): Promise<returnValueModel.User> {
        const answer = await fetch(
            `${url}/user/from_google_auth_token`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "GET",
                body: JSON.stringify(
                    {
                        token, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default UserClient;
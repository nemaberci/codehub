let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
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
        controlSolutions: inputValueModel.SolutionSource[],
        testCases: inputValueModel.TestCase[],
        outputVerifierLocation?: string
    ): Promise<returnValueModel.Challenge> {
        const answer = await fetch(
            `${url}/challenge/upload`,
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        name, 
                        description, 
                        controlSolutions, 
                        testCases, 
                        outputVerifierLocation, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default ChallengeClient;
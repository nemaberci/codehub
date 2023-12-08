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
        shortDescription: string,
        controlSolution?: inputValueModel.SolutionSource,
        testCases?: inputValueModel.TestCase[],
        outputVerifier?: inputValueModel.File
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
                        shortDescription, 
                        controlSolution, 
                        testCases, 
                        outputVerifier, 
                    }
                )
            }
        );
        return await answer.json();
    }
    static async addTestCases(
        authToken: string,
        testCases: inputValueModel.TestCase[],
        outputVerifier: inputValueModel.File
    ): Promise<returnValueModel.Challenge> {
        const answer = await fetch(
            `${url}/challenge/add_test_cases`,
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        testCases, 
                        outputVerifier, 
                    }
                )
            }
        );
        return await answer.json();
    }
    static async addControlSolution(
        authToken: string,
        controlSolution: inputValueModel.SolutionSource
    ): Promise<returnValueModel.Challenge> {
        const answer = await fetch(
            `${url}/challenge/add_control_solution`,
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        controlSolution, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default ChallengeClient;
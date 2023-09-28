let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Stores and handles solutions that are submitted to challenges
*/
class SolutionClient {
    static async solve(
        authToken: string,
        challengeId: string,
        solutionSource: inputValueModel.SolutionSource
    ): Promise<returnValueModel.Solution> {
        const answer = await fetch(
            `${url}/solution/solve`,
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${authToken}`
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        challengeId, 
                        solutionSource, 
                    }
                )
            }
        );
        return await answer.json();
    }
}

export default SolutionClient;
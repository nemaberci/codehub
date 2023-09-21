import * as model from '../../client/inputTypes';

/** 
* @description Solve a challenge
*/
interface SolveBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Id of the challenge to solve
    */
    challengeId: string;
    /** 
    * @description Source of the solution
    */
    solutionSource: model.SolutionSource;
}

export {
    SolveBody
}
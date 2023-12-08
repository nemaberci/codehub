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
    * @description The contents of the source code folder
    */
    folderContents: model.File[];
    /** 
    * @description The entry point of the solution (by default: Solution.java)
    */
    entryPoint?: string;
}
/** 
* @description get results
*/
interface ResultsBody {
    /**
    * @description The user's access token
    */
    authToken: string
    /** 
    * @description Id of the Solution
    */
    solutionId: string;
}

export {
    SolveBody,
    ResultsBody
}
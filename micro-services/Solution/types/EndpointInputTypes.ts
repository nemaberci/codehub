import * as model from '../../client/inputTypes';

/** 
* @description Solve a challenge
*/
interface SolveBody {
    /**
    * @description The user's custom access token
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
    /** 
    * @description The language of the solution (by default: Java)
    */
    language?: string;
}
/** 
* @description List all solutions for a challenge
*/
interface ListBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
    /** 
    * @description Id of the challenge to get the scoreboard of
    */
    challengeId: string;
}
/** 
* @description Get the result of a solution of a challenge for a user
*/
interface ResultBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
    /** 
    * @description Id of the challenge to get the results of
    */
    challengeId: string;
    /** 
    * @description Id of the user to get the results of
    */
    userId: string;
}
/** 
* @description Get the build result of a solution of a challenge for a user
*/
interface BuildResultBody {
    /** 
    * @description Id of the challenge to get the build results of
    */
    challengeId: string;
    /** 
    * @description Id of the user to get the build results of
    */
    userId: string;
}

export {
    SolveBody,
    ListBody,
    ResultBody,
    BuildResultBody
}
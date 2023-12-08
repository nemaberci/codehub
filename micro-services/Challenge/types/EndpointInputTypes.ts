import * as model from '../../client/inputTypes';

/** 
* @description Upload a challenge
*/
interface UploadBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Challenge to upload
    */
    name: string;
    /** 
    * @description Description of the challenge
    */
    description: string;
    /** 
    * @description A shorter description of the challenge
    */
    shortDescription: string;
    /** 
    * @description Control solutions of the challenge
    */
    controlSolution?: model.SolutionSource;
    /** 
    * @description Test cases of the challenge
    */
    testCases?: model.TestCase[];
    /** 
    * @description Output verifier of the challenge
    */
    outputVerifier?: model.File;
}
/** 
* @description Add test cases to a challenge
*/
interface AddTestCasesBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Test cases of the challenge
    */
    testCases?: model.TestCase[];
    /** 
    * @description Output verifier of the challenge
    */
    outputVerifier: model.File;
    /** 
    * @description Id of the challenge to add test cases to
    */
    challengeId: string;
}
/** 
* @description Add a control solution to a challenge
*/
interface AddControlSolutionBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Control solutions of the challenge
    */
    controlSolution: model.SolutionSource;
    /** 
    * @description Id of the challenge to add test cases to
    */
    challengeId: string;
}

export {
    UploadBody,
    AddTestCasesBody,
    AddControlSolutionBody
}
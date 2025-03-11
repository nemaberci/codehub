import * as model from '../../client/inputTypes';

/** 
* @description Upload a challenge
*/
interface UploadBody {
    /**
    * @description The user's custom access token
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
    * @description The enabled languages for the challenge
    */
    enabledLanguages: string[];
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
    /** 
    * @description How much to multiply the time and memory limits by compared to the control solution
    */
    overheadMultiplier?: number;
}
/** 
* @description Add test cases to a challenge
*/
interface AddTestCasesBody {
    /**
    * @description The user's custom access token
    */
    authToken: string,
    /** 
    * @description Test cases of the challenge
    */
    testCases: model.TestCase[];
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
    * @description The user's custom access token
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
/** 
* @description Get a challenge
*/
interface GetBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
    /** 
    * @description Id of the challenge to get
    */
    challengeId: string;
}
/** 
* @description List all challenges
*/
interface ListBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
}
/** 
* @description List all challenges of a user
*/
interface ListByUserBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
    /** 
    * @description Id of the user to get the challenges of
    */
    userId: string;
}
/** 
* @description Delete a challenge
*/
interface DeleteBody {
    /**
    * @description The user's custom access token
    */
    authToken: string
    /** 
    * @description Id of the challenge to delete
    */
    challengeId: string;
}

export {
    UploadBody,
    AddTestCasesBody,
    AddControlSolutionBody,
    GetBody,
    ListBody,
    ListByUserBody,
    DeleteBody
}
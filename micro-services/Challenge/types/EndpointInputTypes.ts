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
    * @description Control solutions of the challenge
    */
    controlSolutions: model.SolutionSource[];
    /** 
    * @description Test cases of the challenge
    */
    testCases: model.TestCase[];
    /** 
    * @description Location of the output verifier source
    */
    outputVerifierLocation?: string;
}

export {
    UploadBody
}
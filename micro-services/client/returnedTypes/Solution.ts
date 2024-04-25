import * as model from "./index";

/** 
* @description 
*/
interface Solution {
    /** 
    * @description The id of the solution
    * @type string
    */
    id: string;
    /** 
    * @description The user that created the solution
    * @type model.User
    */
    user: model.User;
    /** 
    * @description The id of the challenge
    * @type string
    */
    challengeId: string;
    /** 
    * @description The language of the solution
    * @type string
    */
    language: string;
    /** 
    * @description The results of the test cases
    * @type model.TestCaseResult[]
    */
    testCaseResults: model.TestCaseResult[];
    /** 
    * @description The files of the solution
    * @type model.File[]
    */
    files: model.File[] | null;
}

export default Solution
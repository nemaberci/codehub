// @ts-ignore
import * as model from "./index";

/** 
* @description 
*/
interface Challenge {
    /** 
    * @description The id of the challenge
    * @type string
    */
    id: string;
    /** 
    * @description The name of the challenge
    * @type string
    */
    name: string;
    /** 
    * @description The description of the challenge
    * @type string
    */
    description: string;
    /** 
    * @description The short description of the challenge
    * @type string
    */
    shortDescription: string;
    /** 
    * @description The user that created the challenge
    * @type model.User
    */
    user: model.User;
    /** 
    * @description The test cases of the challenge
    * @type model.Testcase[]
    */
    testCases: model.Testcase[];
    /** 
    * @description The date the challenge was created
    * @type string
    */
    createdAt: string;
    /** 
    * @description The enabled languages for the challenge
    * @type string[]
    */
    enabledLanguages: string[];
}

export default Challenge
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
    * @type string
    */
    userId: string;
    /** 
    * @description The test cases of the challenge
    * @type model.Testcase[]
    */
    testCases: model.Testcase[];
    /** 
    * @description The date the challenge was created
    * @type model.CreatedAt
    */
    createdAt: model.CreatedAt;
    /** 
    * @description The enabled languages for the challenge
    * @type string[]
    */
    enabledLanguages: string[];
    /** 
    * @description Whether the output is checked by a script
    * @type boolean
    */
    isOutputScript: boolean;
    /** 
    * @description The output checker python script
    * @type string
    */
    outputScript: string | null;
}

export default Challenge
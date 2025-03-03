import * as model from "./index";

/** 
* @description 
*/
interface TestCase {
    /** 
    * @description The id of the test case (if it exists already).
    * @type string
    */
    id?: string;
    /** 
    * @description The constant input of the test case. Either this or inputGenerator must be provided.
    * @type string
    */
    input?: string;
    /** 
    * @description The input generator python script file. Either this or input must be provided.
    * @type model.File
    */
    inputGenerator?: model.File;
    /** 
    * @description The constant output of the test case. Either this or outputVerifier of the challenge must be provided.
    * @type string
    */
    output?: string;
    /** 
    * @description The points that the test case is worth.
    * @type number
    */
    points: number;
    /** 
    * @description The description of the test case. Optional.
    * @type string
    */
    description: string;
    /** 
    * @description The maximum memory that the test case is allowed to use (KB).
    * @type number
    */
    maxMemory?: number;
    /** 
    * @description The maximum time that the test case is allowed to use (ms).
    * @type number
    */
    maxTime?: number;
    /** 
    * @description The name of the test case.
    * @type string
    */
    name: string;
    /** 
    * @description How much to multiply the time and memory limits by compared to the control solution
    * @type number
    */
    overheadMultiplier: number;
}

export default TestCase
import * as model from "./index";

/** 
* @description 
*/
interface TestCase {
    /** 
    * @description The constant input of the test case. Either this or inputGeneratorFileLocation must be provided.
    * @type string
    */
    input?: string;
    /** 
    * @description The location of the input generator file of the test case. Either this or input must be provided.
    * @type string
    */
    inputGeneratorFileLocation?: string;
    /** 
    * @description The constant output of the test case. Either this or outputVerifierFileLocation of the challenge must be provided.
    * @type string
    */
    output?: string;
    /** 
    * @description The points that the test case is worth.
    * @type number
    */
    points: number;
}

export default TestCase
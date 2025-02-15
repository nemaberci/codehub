// @ts-ignore
import * as model from "./index";

/** 
* @description 
*/
interface Testcase {
    /** 
    * @description The id of the testcase
    * @type string
    */
    id: string;
    /** 
    * @description The name of the testcase
    * @type string
    */
    name: string;
    /** 
    * @description The description of the testcase
    * @type string
    */
    description: string;
    /** 
    * @description The points of the testcase
    * @type number
    */
    points: number;
    /** 
    * @description The max time of the testcase (ms)
    * @type number
    */
    maxTime: number;
    /** 
    * @description The max memory of the testcase (kB)
    * @type number
    */
    maxMemory: number;
    /** 
    * @description The input of the testcase
    * @type string
    */
    input: string | null;
    /** 
    * @description The output of the testcase
    * @type string
    */
    output: string | null;
    /** 
    * @description Whether the input is generated
    * @type boolean
    */
    inputGenerated: boolean | null;
    /** 
    * @description How much to multiply the time and memory limits by compared to the control solution
    * @type number
    */
    overheadMultiplier: number;
}

export default Testcase
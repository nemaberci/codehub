import * as model from "./index";

/** 
* @description 
*/
interface TestCaseLimit {
    /** 
    * @description The time limit (ms)
    * @type number
    */
    time: number;
    /** 
    * @description The memory limit (kB)
    * @type number
    */
    memory: number;
    /** 
    * @description The language that the limits apply to
    * @type string
    */
    language: string;
}

export default TestCaseLimit
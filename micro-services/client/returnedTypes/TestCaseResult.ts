import * as model from "./index";

interface TestCaseResult {
    /** 
    * @description The id of the test case
    * @type string
    */
    testCaseId: string;
    /** 
    * @description The points scored
    * @type number
    */
    points: number;
    /** 
    * @description The memory used (kilobytes)
    * @type number
    */
    memory: number;
    /** 
    * @description The time used (ms)
    * @type number
    */
    time: number;
}

export default TestCaseResult
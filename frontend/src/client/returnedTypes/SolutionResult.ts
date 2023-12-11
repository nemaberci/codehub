import * as model from "./index";

/** 
* @description 
*/
interface SolutionResult {
    /** 
    * @description Recived points.
    * @type number
    */
    points: number;
    /** 
    * @description what do you think?
    * @type string
    */
    testCaseId: string;
    /** 
    * @description Memory used.
    * @type number
    */
    memory: number | null;
    /** 
    * @description Time used.
    * @type number
    */
    time: number | null;
}

export default SolutionResult
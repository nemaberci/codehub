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
}

export default Testcase
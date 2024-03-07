import * as model from "./index";

/** 
* @description 
*/
interface SolutionBuildResult {
    /** 
    * @description The id of the solution
    * @type string
    */
    solutionId: string;
    /** 
    * @description The result of the build
    * @type string
    */
    buildResult: string;
    /** 
    * @description The output of the build
    * @type string
    */
    buildOutput: string;
}

export default SolutionBuildResult
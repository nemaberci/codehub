import * as model from "./index";

interface SolutionBuildResult {
    /** 
    * @description The id of the solution
    * @type string
    */
    solutionId: string;
    /** 
    * @description The result of the build
    * @type boolean
    */
    buildResult: boolean;
    /** 
    * @description The output of the build
    * @type string
    */
    buildOutput: string;
}

export default SolutionBuildResult
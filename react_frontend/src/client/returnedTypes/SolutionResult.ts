// @ts-ignore
import * as model from "./index";

interface SolutionResult {
    /** 
    * @description The user that created the solution
    * @type model.User
    */
    user: model.User;
    /** 
    * @description The maximum points that were scored
    * @type number
    */
    maxPoints: number;
    /** 
    * @description The maximum memory that was used in the best solution (kB)
    * @type number
    */
    maxMemory: number;
    /** 
    * @description The language of the best solution
    * @type string
    */
    language: string;
    /** 
    * @description The number of attempts
    * @type number
    */
    attempts: number;
}

export default SolutionResult
import * as model from "./index";

/** 
* @description 
*/
interface SolutionSource {
    /** 
    * @description The language of the solution
    * @type string
    */
    language: string;
    /** 
    * @description The locations of the source files of the solution
    * @type string[]
    */
    sourceFileLocations: string[];
    /** 
    * @description The location of the entry point file of the solution
    * @type string
    */
    entryPointFileLocation: string;
}

export default SolutionSource
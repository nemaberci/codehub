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
    * @description The contents of the source code folder
    * @type model.File[]
    */
    folderContents: model.File[];
    /** 
    * @description The entry point of the solution (by default: Solution.java)
    * @type string
    */
    entryPoint?: string;
}

export default SolutionSource
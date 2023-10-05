import * as model from '../../client/inputTypes';

/** 
* @description Compile java source code
*/
interface CompileBody {
    /** 
    * @description Name of the folder that contains the source code
    */
    inputFolderName: string;
    /** 
    * @description Name of the class that contains the main method
    */
    entryPoint: string;
    /** 
    * @description Name of the folder to put the compiled code into
    */
    outputFolderName: string;
    /** 
    * @description Maximum time to wait for the compilation to finish in milliseconds
    */
    maxTime: number;
}

export {
    CompileBody
}
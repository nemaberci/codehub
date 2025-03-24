// @ts-ignore
import * as model from "./index";

interface File {
    /** 
    * @description The name of the file
    * @type string
    */
    name: string;
    /** 
    * @description The content of the file encoded in Base64.
    * @type string
    */
    content: string;
}

export default File
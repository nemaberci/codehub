import * as model from '../../client/inputTypes';

/** 
* @description Upload the content of a folder
*/
interface UploadFolderContentBody {
    /** 
    * @description Files to upload
    */
    files: model.File[];
    /** 
    * @description Name of the folder to upload the content to
    */
    folderName: string;
}
/** 
* @description Download the content of a folder
*/
interface DownloadFolderContentBody {
    /** 
    * @description Name of the folder to download the content from
    */
    folderName: string;
}
/** 
* @description Delete a folder
*/
interface DeleteFolderBody {
    /** 
    * @description Name of the folder to delete
    */
    folderName: string;
}

export {
    UploadFolderContentBody,
    DownloadFolderContentBody,
    DeleteFolderBody
}
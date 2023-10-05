let url = "127.0.0.1:3000";
if (typeof (window as any).MICRO_SERVICE_URL !== "undefined") {
    url = (window as any).MICRO_SERVICE_URL as string;
}
import * as returnValueModel from "./returnedTypes";
import * as inputValueModel from "./inputTypes";

/** 
* @description Tools for uploading, listing and downloading files. Users can only operate on their own files and folders.
*/
class FileHandlingClient {
    static async uploadFolderContent(
        files: inputValueModel.File[]
    ): Promise<> {
        const answer = await fetch(
            `${url}/file_handling/upload_folder_content`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        files, 
                    }
                )
            }
        );
        return await answer.json();
    }
    static async downloadFolderContent(
    ): Promise<returnValueModel.File> {
        const answer = await fetch(
            `${url}/file_handling/download_folder_content`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "GET"            }
        );
        return await answer.json();
    }
    static async deleteFolder(
    ): Promise<> {
        const answer = await fetch(
            `${url}/file_handling/delete_folder`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "DELETE"            }
        );
        return await answer.json();
    }
}

export default FileHandlingClient;
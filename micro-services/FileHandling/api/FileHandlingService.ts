import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface FileHandlingService {
    uploadFolderContent(body: EndpointInputTypes.UploadFolderContentBody): Promise<EndpointReturnedTypes.UploadFolderContentReturned>
    downloadFolderContent(body: EndpointInputTypes.DownloadFolderContentBody): Promise<EndpointReturnedTypes.DownloadFolderContentReturned>
    downloadFile(body: EndpointInputTypes.DownloadFileBody): Promise<EndpointReturnedTypes.DownloadFileReturned>
    deleteFolder(body: EndpointInputTypes.DeleteFolderBody): Promise<EndpointReturnedTypes.DeleteFolderReturned>
}
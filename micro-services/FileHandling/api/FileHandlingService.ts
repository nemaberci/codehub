import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";
import { Express } from 'express'

export default interface FileHandlingService {
    registerCustomCallbacks?(app: Express): void
    uploadFolderContent(body: EndpointInputTypes.UploadFolderContentBody): Promise<EndpointReturnedTypes.UploadFolderContentReturned>
    downloadFolderContent(body: EndpointInputTypes.DownloadFolderContentBody): Promise<EndpointReturnedTypes.DownloadFolderContentReturned>
    downloadFile(body: EndpointInputTypes.DownloadFileBody): Promise<EndpointReturnedTypes.DownloadFileReturned>
    deleteFolder(body: EndpointInputTypes.DeleteFolderBody): Promise<EndpointReturnedTypes.DeleteFolderReturned>
}
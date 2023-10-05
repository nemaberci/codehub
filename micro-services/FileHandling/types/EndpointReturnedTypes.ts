import * as model from '../../client/returnedTypes';

type UploadFolderContentReturned = boolean;
type DownloadFolderContentReturned = model.File[];
type DeleteFolderReturned = boolean;

export {
    UploadFolderContentReturned,
    DownloadFolderContentReturned,
    DeleteFolderReturned
}
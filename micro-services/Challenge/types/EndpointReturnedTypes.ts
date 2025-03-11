import * as model from '../../client/returnedTypes';

type UploadReturned = model.Challenge;
type AddTestCasesReturned = model.Challenge;
type AddControlSolutionReturned = model.Challenge;
type GetReturned = model.Challenge;
type ListReturned = model.Challenge[];
type ListByUserReturned = model.Challenge[];
type DeleteReturned = boolean;

export {
    UploadReturned,
    AddTestCasesReturned,
    AddControlSolutionReturned,
    GetReturned,
    ListReturned,
    ListByUserReturned,
    DeleteReturned
}
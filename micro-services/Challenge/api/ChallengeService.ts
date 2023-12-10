import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface ChallengeService {
    upload(body: EndpointInputTypes.UploadBody): Promise<EndpointReturnedTypes.UploadReturned>
    addTestCases(body: EndpointInputTypes.AddTestCasesBody): Promise<EndpointReturnedTypes.AddTestCasesReturned>
    addControlSolution(body: EndpointInputTypes.AddControlSolutionBody): Promise<EndpointReturnedTypes.AddControlSolutionReturned>
    get(body: EndpointInputTypes.GetBody): Promise<EndpointReturnedTypes.GetReturned>
    list(body: EndpointInputTypes.ListBody): Promise<EndpointReturnedTypes.ListReturned>
    listByUser(body: EndpointInputTypes.ListByUserBody): Promise<EndpointReturnedTypes.ListByUserReturned>
}
import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";
import { Express } from 'express'

export default interface ChallengeService {
    registerCustomCallbacks?(app: Express): void
    upload(body: EndpointInputTypes.UploadBody): Promise<EndpointReturnedTypes.UploadReturned>
    addTestCases(body: EndpointInputTypes.AddTestCasesBody): Promise<EndpointReturnedTypes.AddTestCasesReturned>
    addControlSolution(body: EndpointInputTypes.AddControlSolutionBody): Promise<EndpointReturnedTypes.AddControlSolutionReturned>
    get(body: EndpointInputTypes.GetBody): Promise<EndpointReturnedTypes.GetReturned>
    list(body: EndpointInputTypes.ListBody): Promise<EndpointReturnedTypes.ListReturned>
    listByUser(body: EndpointInputTypes.ListByUserBody): Promise<EndpointReturnedTypes.ListByUserReturned>
    delete(body: EndpointInputTypes.DeleteBody): Promise<EndpointReturnedTypes.DeleteReturned>
}
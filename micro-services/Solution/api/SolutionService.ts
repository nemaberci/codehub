import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";
import { Express } from 'express'

export default interface SolutionService {
    registerCustomCallbacks?(app: Express): void
    solve(body: EndpointInputTypes.SolveBody): Promise<EndpointReturnedTypes.SolveReturned>
    list(body: EndpointInputTypes.ListBody): Promise<EndpointReturnedTypes.ListReturned>
    result(body: EndpointInputTypes.ResultBody): Promise<EndpointReturnedTypes.ResultReturned>
    buildResult(body: EndpointInputTypes.BuildResultBody): Promise<EndpointReturnedTypes.BuildResultReturned>
}
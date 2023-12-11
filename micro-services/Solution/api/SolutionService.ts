import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface SolutionService {
    solve(body: EndpointInputTypes.SolveBody): Promise<EndpointReturnedTypes.SolveReturned>
    list(body: EndpointInputTypes.ListBody): Promise<EndpointReturnedTypes.ListReturned>
    result(body: EndpointInputTypes.ResultBody): Promise<EndpointReturnedTypes.ResultReturned>
}
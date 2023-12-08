import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface SolutionService {
    solve(body: EndpointInputTypes.SolveBody): Promise<EndpointReturnedTypes.SolveReturned>
    results(body: EndpointInputTypes.ResultsBody): Promise<EndpointReturnedTypes.ResultsReturned>
}
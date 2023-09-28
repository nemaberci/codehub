import { Solution } from "../../client/returnedTypes";
import SolutionService from "../api/SolutionService";
import { SolveBody } from "../types/EndpointInputTypes";

export default class SolutionImpl implements SolutionService {
    solve(body: SolveBody): Promise<Solution> {
        throw new Error("Method not implemented.");
    }

}
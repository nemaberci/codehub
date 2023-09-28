import { Challenge } from "../../client/returnedTypes";
import { UploadBody } from "../types/EndpointInputTypes";
import ChallengeService from "../api/ChallengeService";

export default class ChallengeImpl implements ChallengeService {
    upload(body: UploadBody): Promise<Challenge> {
        throw new Error("Method not implemented.");
    }
}
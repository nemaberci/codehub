import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface ChallengeService {
    upload(body: EndpointInputTypes.UploadBody): Promise<EndpointReturnedTypes.UploadReturned>
}
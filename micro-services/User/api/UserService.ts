import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface UserService {
    byEmailAddress(body: EndpointInputTypes.ByEmailAddressBody): Promise<EndpointReturnedTypes.ByEmailAddressReturned>
}
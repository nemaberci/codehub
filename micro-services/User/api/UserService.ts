import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";

export default interface UserService {
    login(body: EndpointInputTypes.LoginBody): Promise<EndpointReturnedTypes.LoginReturned>
    register(body: EndpointInputTypes.RegisterBody): Promise<EndpointReturnedTypes.RegisterReturned>
}
import { User } from "../../client/returnedTypes";
import UserService from "../api/UserService";
import { ByEmailAddressBody } from "../types/EndpointInputTypes";

export default class UserImpl implements UserService {
    byEmailAddress(body: ByEmailAddressBody): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
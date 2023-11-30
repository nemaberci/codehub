import { User } from "../../client/returnedTypes";
import UserService from "../api/UserService";
import { ByEmailAddressBody, FromGoogleAuthTokenBody } from "../types/EndpointInputTypes";

export default class UserImpl implements UserService {
    fromGoogleAuthToken(body: FromGoogleAuthTokenBody): Promise<User> {
        throw new Error("Method not implemented.");
    }
    byEmailAddress(body: ByEmailAddressBody): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
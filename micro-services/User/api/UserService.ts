import * as EndpointInputTypes from "../types/EndpointInputTypes";
import * as EndpointReturnedTypes from "../types/EndpointReturnedTypes";
import { Express } from 'express'

export default interface UserService {
    registerCustomCallbacks?(app: Express): void
    login(body: EndpointInputTypes.LoginBody): Promise<EndpointReturnedTypes.LoginReturned>
    byId(body: EndpointInputTypes.ByIdBody): Promise<EndpointReturnedTypes.ByIdReturned>
    register(body: EndpointInputTypes.RegisterBody): Promise<EndpointReturnedTypes.RegisterReturned>
    addRoles(body: EndpointInputTypes.AddRolesBody): Promise<EndpointReturnedTypes.AddRolesReturned>
    removeRoles(body: EndpointInputTypes.RemoveRolesBody): Promise<EndpointReturnedTypes.RemoveRolesReturned>
    hasRoles(body: EndpointInputTypes.HasRolesBody): Promise<EndpointReturnedTypes.HasRolesReturned>
}
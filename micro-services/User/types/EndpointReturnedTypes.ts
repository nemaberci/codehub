import * as model from '../../client/returnedTypes';

type LoginReturned = string;
type ByIdReturned = model.User;
type RegisterReturned = string;
type AddRolesReturned = boolean;
type RemoveRolesReturned = boolean;
type HasRolesReturned = boolean;

export {
    LoginReturned,
    ByIdReturned,
    RegisterReturned,
    AddRolesReturned,
    RemoveRolesReturned,
    HasRolesReturned
}
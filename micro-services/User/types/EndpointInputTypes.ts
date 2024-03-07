import * as model from '../../client/inputTypes';

/** 
* @description Login using username and password. Returns a JWT that can be used to access other services.
*/
interface LoginBody {
    /** 
    * @description The username of the user
    */
    username: string;
    /** 
    * @description The password of the user
    */
    password: string;
}
/** 
* @description Register a new user
*/
interface RegisterBody {
    /** 
    * @description The username of the user
    */
    username: string;
    /** 
    * @description The password of the user
    */
    password: string;
}
/** 
* @description Add roles to a user
*/
interface AddRolesBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Roles to add to the user
    */
    roles: string[];
    /** 
    * @description Id of the user to add roles to
    */
    username: string;
}
/** 
* @description Remove roles from a user
*/
interface RemoveRolesBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Roles to remove from the user
    */
    roles: string[];
    /** 
    * @description Id of the user to remove roles from
    */
    username: string;
}

export {
    LoginBody,
    RegisterBody,
    AddRolesBody,
    RemoveRolesBody
}
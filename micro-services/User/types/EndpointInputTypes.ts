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
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description The username of the user
    */
    username: string;
    /** 
    * @description The password of the user
    */
    password: string;
}

export {
    LoginBody,
    RegisterBody
}
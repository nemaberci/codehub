import * as model from '../../client/inputTypes';

/** 
* @description Get user by email address
*/
interface ByEmailAddressBody {
    /**
    * @description The user's access token
    */
    authToken: string,
    /** 
    * @description Email address of the user
    */
    emailAddress: string;
}

export {
    ByEmailAddressBody
}
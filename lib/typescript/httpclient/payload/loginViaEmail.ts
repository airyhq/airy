import { doFetchFromBackend } from '../api';
import { UserPayload, LoginViaEmailRequestPayload } from '../model';


export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
    return doFetchFromBackend('users.login', requestPayload)
        .then((response: UserPayload) => {
            return response;
        })
        .catch((error: Error) => {
            return error;
        });
}
import {doFetchFromBackend} from '../api';
import {LoginViaEmailRequestPayload} from '../payload';
import {UserPayload} from '../payload/UserPayload';
import {userMapper} from '../mappers/userMapper';

export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
  return doFetchFromBackend('users.login', requestPayload)
    .then((response: UserPayload) => {
      return userMapper(response);
    })
    .catch((error: Error) => {
      return error;
    });
}

import {doFetchFromBackend} from '../api';
import {User} from '../model';
import {LoginViaEmailRequestPayload} from '../payload';
import {UserPayload} from '../payload/UserPayload';

const userMapper = (payload: UserPayload): User => {
  return {
    id: payload.id,
    firstName: payload.first_name,
    lastName: payload.last_name,
    displayName: payload.first_name + ' ' + payload.last_name,
    token: payload.token,
  };
};

export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
  return doFetchFromBackend('users.login', requestPayload)
    .then((response: UserPayload) => {
      return userMapper(response);
    })
    .catch((error: Error) => {
      return error;
    });
}

import {doFetchFromBackend} from '../api';
import {User} from '../model';
import {UserPayload, LoginViaEmailRequestPayload} from '../payload';

const userMapper = (payload: UserPayload): User => {
  const user: User = {
    id: payload.id,
    firstName: payload.first_name,
    lastName: payload.last_name,
    displayName: payload.first_name + ' ' + payload.last_name,
    token: payload.token,
  };
  return user;
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

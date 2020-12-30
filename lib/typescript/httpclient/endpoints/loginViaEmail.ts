import {doFetchFromBackend} from '../api';
import {User} from '../model';
import {UserPayload, LoginViaEmailRequestPayload} from '../payload';

export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
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

  return doFetchFromBackend('users.login', requestPayload)
    .then((response: UserPayload) => {
      const userInfo = userMapper(response);
      return userInfo;
    })
    .catch((error: Error) => {
      return error;
    });
}

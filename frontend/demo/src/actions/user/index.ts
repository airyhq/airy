import {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {doFetchFromBackend} from '../../api/airyConfig';

import {User, userMapper, UserPayload} from '../../model/User';

const SET_CURRENT_USER = '@@auth/SET_CURRENT_USER';
const USER_AUTH_ERROR = '@@auth/ERROR';
const USER_LOGOUT = '@@auth/LOGOUT_USER';

export const setCurrentUserAction = createAction(SET_CURRENT_USER, resolve => (user: User) => resolve(user));

export const userAuthErrorAction = createAction(USER_AUTH_ERROR, resolve => (error: Error) => resolve(error));

export const logoutUserAction = createAction(USER_LOGOUT);

export const logoutUser = () => {
  return function(dispatch: Dispatch) {
    dispatch(logoutUserAction());
  };
};

export interface LoginViaEmailRequestPayload {
  email: String;
  password: String;
}

export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('users.login', requestPayload)
      .then((response: UserPayload) => {
        const user = userMapper(response);
        dispatch(setCurrentUserAction(user));
        return Promise.resolve(user);
      })
      .catch((error: Error) => {
        dispatch(userAuthErrorAction(error));
        return Promise.reject(error);
      });
  };
}

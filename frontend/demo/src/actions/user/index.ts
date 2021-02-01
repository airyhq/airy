import {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {User, LoginViaEmailRequestPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const SET_CURRENT_USER = '@@auth/SET_CURRENT_USER';
const USER_AUTH_ERROR = '@@auth/ERROR';
const USER_LOGOUT = '@@auth/LOGOUT_USER';

export const setCurrentUserAction = createAction(SET_CURRENT_USER, resolve => (user: User) => resolve(user));
export const userAuthErrorAction = createAction(USER_AUTH_ERROR, resolve => (error: Error) => resolve(error));
export const logoutUserAction = createAction(USER_LOGOUT);

export function loginViaEmail(requestPayload: LoginViaEmailRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.loginViaEmail(requestPayload)
      .then((response: User) => {
        dispatch(setCurrentUserAction(response));
        HttpClientInstance.token = response.token;
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        dispatch(userAuthErrorAction(error));
        return Promise.reject(error);
      });
  };
}

export function logoutUser() {
  return async (dispatch: Dispatch<any>) => {
    HttpClientInstance.token = null;
    dispatch(logoutUserAction());
  };
}

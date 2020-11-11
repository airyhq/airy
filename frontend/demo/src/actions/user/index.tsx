import { createAction } from "typesafe-actions";
import _, { Dispatch } from "redux";

import { doFetchFromBackend } from "../../api/airyConfig";

import { User } from "../../model/User";

const SET_CURRENT_USER = "@@auth/SET_CURRENT_USER";
const USER_AUTH_ERROR = "@@auth/ERROR";
const USER_LOGOUT = "@@auth/LOGOUT_USER";

export const setCurrentUserAction = createAction(
  SET_CURRENT_USER,
  resolve => (user: User) => resolve(user)
);
export const userAuthErrorAction = createAction(
  USER_AUTH_ERROR,
  resolve => (error: Error) => resolve(error)
);
export const logoutUserAction = createAction(USER_LOGOUT);

export const logoutUser = () => {
  return function(dispatch: Dispatch) {
    dispatch(logoutUserAction());
  };
};

export function loginViaEmail(email: String, password: String) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend("users.login", {
      email,
      password
    })
      .then((response: User) => {
        dispatch(setCurrentUserAction(response));
        return true;
      })
      .catch((error: Error) => {
        dispatch(userAuthErrorAction(error));
        return false;
      });
  };
}

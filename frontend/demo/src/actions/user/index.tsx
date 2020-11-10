import {Organization} from '../../model/Organization';
import {User} from '../../model/User';
import {createAction} from 'typesafe-actions';

import _, {Dispatch} from 'redux';

const SET_CURRENT_USER = '@@auth/SET_CURRENT_USER';
const USER_AUTH_ERROR = '@@auth/ERROR';
const USER_LOGOUT = '@@auth/LOGOUT_USER';
const FB_LOGIN = '@@auth/FB_LOGIN';
const AUTH_RENAME = '@@auth/RENAME';
const AUTH_RENAME_ERROR = '@@auth/RENAME_ERROR';

export const setCurrentUserAction = createAction(SET_CURRENT_USER, resolve => (user: User) => resolve(user));

export const userAuthErrorAction = createAction(USER_AUTH_ERROR, resolve => (error: Error) => resolve(error));

export const authRenameAction = createAction(AUTH_RENAME, resolve => (org: Organization) => resolve(org));
export const authRenameErrorAction = createAction(AUTH_RENAME_ERROR, resolve => (error: Error) => resolve(error));

export const logoutUserAction = createAction(USER_LOGOUT);

export const logoutUser = () => {
  return function(dispatch: Dispatch) {
    dispatch(logoutUserAction());
  };
};

export const refreshUser = () => {
  // return AiryAPIWithAuth.fetchSessionToken();
};

export const facebookLoggedIn = createAction(FB_LOGIN, resolve => (FbToken: string) => resolve(FbToken));

async function parseBody(response: Response): Promise<any> {
  if (response.ok) {
    return response.json();
  }

  let body = await response.text();
  if (body.length > 0) {
    body = JSON.parse(body);
  }

  const errorResponse = {
    status: response.status,
    body: body,
  };

  throw errorResponse;
}

function isString(object: any) {
  return typeof object === 'string' || object instanceof String;
}

const doFetchFromBackend = async (url: string, body?: Object, retryCount: number = 0): Promise<any> => {
  
  const headers = {  
    Accept: 'application/json',
  };

  // const token = getAuthToken();
  // if (token) {
  //   headers['Authorization'] = token;
  // }

  if (!(body instanceof FormData)) {
    if (!isString(body)) {
      body = JSON.stringify(body);
    }
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response: Response = await fetch(`http://192.168.50.5/${url}`, {
      method: 'POST',
      headers: headers,
      body: body as BodyInit,
    });

    return parseBody(response);
  } catch (error) {
    return error;
  }
}

export function loginViaEmail(email: String, password: String) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('users.login', {
      email,
      password,
    }).then(response => {
      dispatch(setCurrentUserAction(response));
      return true;
    }).catch(error => {
      dispatch(userAuthErrorAction(error));
      return false;
    });    
  };
};

export const registerViaEmail = (firstName, lastName, email, password) => {
  return dispatch => {
  //   return AiryAPIWithoutAuth.fetchFromBackend('signup', {
  //     first_name: firstName,
  //     last_name: lastName,
  //     email: email,
  //     password: password,
  //   })
  //     .then(response => {
  //       dispatch(setCurrentUserAction(response));
  //     })
  //     .catch(error => {
  //       dispatch(userAuthErrorAction(error));
  //     });
  };
};

export const loginViaFacebook = (fbResponse, persist = true) => {
  return dispatch => {
    // return AiryAPIWithoutAuth.fetchFromBackend('login-via-facebook', {
    //   user_access_token: fbResponse.accessToken,
    //   user_id: fbResponse.id,
    // }).then(response => {
    //   persist && dispatch(setCurrentUserAction(response));
    //   dispatch(facebookLoggedIn(fbResponse.accessToken));
    //   return response;
    // });
  };
};

export const sendResetPassword = (
  email: string,
  recaptcha_response: string,
  completion: (created: boolean) => void
) => () => {
  // return AiryAPIWithoutAuth.fetchFromBackend('request-password-reset', {
  //   email: email,
  //   recaptcha_response: recaptcha_response,
  // })
  //   .then(() => {
  //     completion(true);
  //   })
  //   .catch(() => {
  //     completion(true);
  //   });
};

export const resetPassword = (password: string, token: string, completion: (created: boolean) => void) => () => {
  // AiryAPIWithoutAuth.fetchFromBackend('reset-password', {
  //   token: token,
  //   new_password: password,
  // })
  //   .then(() => {
  //     completion(true);
  //   })
  //   .catch(() => {
  //     completion(true);
  //   });
};

export const createOrganization = orgName => dispatch => {
  // return AiryAPIWithAuth.fetchFromBackend('create-organization', {
  //   name: orgName,
  // })
  //   .then(response => {
  //     dispatch(setCurrentUserAction(response));
  //     return response;
  //   })
  //   .catch(error => {
  //     dispatch(userAuthErrorAction(error));
  //     return false;
    // });
};

export const renameOrganization = (organization_id, name) => dispatch => {
  // return AiryAPIWithAuth.fetchFromBackend('rename-organization', {
  //   organization_id,
  //   name,
  // })
  //   .then(() => {
  //     dispatch(
  //       authRenameAction({
  //         id: organization_id,
  //         name,
  //       })
  //     );
  //   })
  //   .catch(error => {
      // return authRenameErrorAction(error);
    // });
};

export const fetchInvitation = (
  invitationId: string,
  fetchInvitationHandler: (info: any) => void,
  fetchInvitationErrorHandler: () => void
) => {
  return () => {
  //   return AiryAPIWithoutAuth.fetchFromBackend('fetch-open-invitation', {
  //     id: invitationId,
  //   })
  //     .then(response => {
  //       fetchInvitationHandler(response);
  //     })
  //     .catch(() => {
  //       fetchInvitationErrorHandler();
  //     });
  };

};

export const acceptInvitation = (invitationId: string, firstName: string, lastName: string, password: string) => {
  return dispatch => {
  //   return AiryAPIWithoutAuth.fetchFromBackend('signup-via-invitation', {
  //     id: invitationId,
  //     first_name: firstName,
  //     last_name: lastName,
  //     password: password,
  //   })
  //     .then(response => {
  //       dispatch(setCurrentUserAction(response));
  //     })
  //     .catch(error => {
  //       dispatch(userAuthErrorAction(error));
  //     });
  };
};

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  token: string;
  email?: string;
  isAuthSuccess?: boolean;
  onboarded?: boolean;
  error?: string;
}

export interface UserPayload {
  id: string;
  first_name: string;
  last_name: string;
  token: string;
}

export const userMapper = (payload: UserPayload): User => {
  const user: User = {
    id: payload.id,
    firstName: payload.first_name,
    lastName: payload.last_name,
    displayName: payload.first_name + " " + payload.last_name,
    token: payload.token
  };
  return user;
};

export enum AUTH_STATE {
  NOT_AUTHENTICATED,
  REFRESHING,
  AUTHENTICATED_AND_LOADED
}

export const authState = (state: User) => {
  return state.id ? AUTH_STATE.NOT_AUTHENTICATED : AUTH_STATE.REFRESHING;
};

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

export enum AUTH_STATE {
  NOT_AUTHENTICATED,
  REFRESHING,
  AUTHENTICATED_AND_LOADED,
}

export const authState = (state: User) => {
  return state.id ? AUTH_STATE.NOT_AUTHENTICATED : AUTH_STATE.REFRESHING;
};

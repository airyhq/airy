import { Organization } from "./Organization";
import { Membership } from "./Membership";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  display_name?: string;
  token?: string;
  isAuthSuccess?: boolean;
  onboarded?: boolean;
  error: string;
}

export enum AUTH_STATE {
  NOT_AUTHENTICATED,
  REFRESHING,
  AUTHENTICATED_AND_LOADED
}

export const authState = (state: User) => {
  if (!state.id) {
    return AUTH_STATE.REFRESHING;
  }
  return AUTH_STATE.NOT_AUTHENTICATED;
};

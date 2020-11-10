import { Organization } from "./Organization";
import { Membership } from "./Membership";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  display_name?: string;
  token?: string;
  refresh_token?: string;
  fbToken?: string;
  isAuthSuccess?: boolean;
  onboarded?: boolean;
  organizations?: Organization[];
  memberships?: Membership[];
  error: string;
}

export enum AUTH_STATE {
  NOT_AUTHENTICATED,
  REFRESHING,
  AUTHENTICATED_AND_LOADED
}

export const authState = (state: User) => {
  if (!!state.refresh_token) {
    if (!state.id || !state.organizations) {
      return AUTH_STATE.REFRESHING;
    }

    return AUTH_STATE.AUTHENTICATED_AND_LOADED;
  }

  return AUTH_STATE.NOT_AUTHENTICATED;
};

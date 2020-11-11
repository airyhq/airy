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

export function userInitials(user: User) {
  if (user.display_name) {
    return user.display_name.substring(0, 2);
  }

  let result = "";

  if (user.first_name) {
    result += user.first_name.substring(0, 1);
  }

  if (user.last_name) {
    result += user.last_name.substring(0, 1);
  }

  return result;
}

export function displayName(user: User) {
  return user.display_name || user.first_name || user.last_name || "";
}

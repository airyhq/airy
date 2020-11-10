import { AiryConfig } from "./airyConfig";
import { getCookie, setCookie } from "./cookie";
import { User } from "../model/User";

export const storeDomainCookie = (key: string) => (token: string) => {
  let domain = AiryConfig.TOP_DOMAIN;

  // If we are on development or don't have access to {domain} we set it to the current domain
  if (AiryConfig.NODE_ENV !== "production" || !document.domain.endsWith("")) {
    domain = document.domain;
  }

  setCookie(key, token, domain);
};

export const setUserId = storeDomainCookie("user_id");
export const setAuthToken = storeDomainCookie("auth_token");
export const setRefreshToken = storeDomainCookie("refresh_token");
export const getUserId = () => getCookie("user_id");
export const getAuthToken = () => getCookie("auth_token");

export function storeUserData(data: User) {
  setRefreshToken(data.refresh_token);

  if (data.refresh_token) {
    localStorage.setItem("id", data.id);
    localStorage.setItem("first_name", data.first_name);
    localStorage.setItem("last_name", data.last_name);
    localStorage.setItem("isAuthSuccess", JSON.stringify(true));
    setAuthToken(data.token);
    setUserId(data.id);
  }
}

export function clearUserData() {
  localStorage.clear();
  setAuthToken("");
  setUserId("");
}

export const getUserFromStore = () => {
  const tokens = {
    token: getAuthToken()
  };

  if (localStorage.id) {
    return {
      isAuthSuccess: localStorage.isAuthSuccess,
      id: localStorage.id,
      first_name: localStorage.first_name,
      last_name: localStorage.last_name,
      role: localStorage.role,
      ...tokens
    };
  } else {
    return {
      ...tokens
    };
  }
};

export const notifyOnAuthChange = (callback: (userId: string) => void) => {
  let userId = getUserId();
  setInterval(() => {
    const newUserId = getUserId();
    if (userId !== newUserId) {
      userId = newUserId;
      callback(newUserId);
    }
  }, 1000);
};

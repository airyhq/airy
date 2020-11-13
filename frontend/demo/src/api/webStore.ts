import { getCookie, setCookie } from "./cookie";
import { User } from "../model/User";

export const storeDomainCookie = (key: string) => (token: string) => {
  setCookie(key, token, document.domain);
};

export const setUserId = storeDomainCookie("userId");
export const setAuthToken = storeDomainCookie("authToken");
export const getUserId = () => getCookie("userId");
export const getAuthToken = () => getCookie("authToken");

export function storeUserData(data: User) {
  if (data.token) {
    localStorage.setItem("id", data.id);
    localStorage.setItem("firstName", data.firstName);
    localStorage.setItem("lastName", data.lastName);
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
      firstName: localStorage.firstName,
      lastName: localStorage.lastName,
      role: localStorage.role,
      ...tokens
    };
  }

  return {
    ...tokens
  };
};

export const notifyOnAuthChange = (callback: (userId: string) => void) => {
  let userId = getUserId();
  const interval = setInterval(() => {
    const newUserId = getUserId();
    if (userId !== newUserId) {
      userId = newUserId;
      callback(newUserId);
    }
  }, 1000);
  return () => clearInterval(interval);
};

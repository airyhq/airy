import {AiryConfig} from './airyConfig';
import {getCookie, setCookie} from './cookie';
import {User} from '../model/User';
import {Membership} from '../model/Membership';

export const storeDomainCookie = key => token => {
  let domain = AiryConfig.TOP_DOMAIN;

  // If we are on development or don't have access to airy.co we set it to the current domain
  if (AiryConfig.NODE_ENV !== 'production' || !document.domain.endsWith('airy.co')) {
    domain = document.domain;
  }

  setCookie(key, token, domain);
};

export const setUserId = storeDomainCookie('user_id');
export const setAuthToken = storeDomainCookie('auth_token');
export const setRefreshToken = storeDomainCookie('refresh_token');
export const getUserId = () => getCookie('user_id');
export const getAuthToken = () => getCookie('auth_token');
export const getRefreshToken = () => getCookie('refresh_token');

export function storeUserData(data: User) {
  setRefreshToken(data.refresh_token);

  if (data.refresh_token) {
    localStorage.setItem('id', data.id);
    localStorage.setItem('first_name', data.first_name);
    localStorage.setItem('last_name', data.last_name);
    localStorage.setItem('fbToken', data.fbToken || '');
    localStorage.setItem('organizations', JSON.stringify(data.organizations));
    if (data.organizations.length) {
      localStorage.setItem('orgId', data.organizations[0].id);
      localStorage.setItem('orgName', data.organizations[0].name);
      data.memberships &&
        data.memberships.forEach((membership: Membership) => {
          if (data.organizations[0].id === membership.organization_id) {
            localStorage.setItem('role', membership.role);
          }
        });
    }
    localStorage.setItem('isAuthSuccess', JSON.stringify(true));
    setAuthToken(data.token);
    setUserId(data.id);
  }
}

export function clearUserData() {
  localStorage.clear();
  setAuthToken('');
  setRefreshToken('');
  setUserId('');
}

export const getUserFromStore = () => {
  const tokens = {
    refresh_token: getRefreshToken(),
    token: getAuthToken(),
  };

  if (localStorage.id) {
    return {
      isAuthSuccess: localStorage.isAuthSuccess,
      id: localStorage.id,
      orgId: localStorage.orgId,
      first_name: localStorage.first_name,
      last_name: localStorage.last_name,
      role: localStorage.role,
      orgName: localStorage.orgName,
      fbToken: localStorage.fbToken,
      organizations: JSON.parse(localStorage.organizations || '[]'),
      ...tokens,
    };
  } else {
    return {
      ...tokens,
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

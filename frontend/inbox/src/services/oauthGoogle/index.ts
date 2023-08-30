import jwt_decode from 'jwt-decode';
import {env} from '../../env';

const SCOPES =
  'https://www.googleapis.com/auth/gmail.readonly \
https://www.googleapis.com/auth/gmail.send  \
https://www.googleapis.com/auth/userinfo.profile \
https://www.googleapis.com/auth/userinfo.email \
https://mail.google.com/';

export const initializeOauth = () => {
  window.google.accounts.id.initialize({
    client_id: env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
    callback: handleCredentialResponse,
  });
};

export const handleCredentialResponse = response => {
  localStorage.setItem('googleUserCredentials', JSON.stringify(response));
  const decoded = jwt_decode(response['credential']);
  localStorage.setItem('googleUserInfo', JSON.stringify(decoded));
  getAuthCode();
};

const getAuthCode = () => {
  const client = window.google.accounts.oauth2.initCodeClient({
    client_id: env.GOOGLE_CLIENT_ID,
    scope: SCOPES,
    ux_mode: 'redirect',
    redirect_uri: env.GOOGLE_REDIRECT_URL,
  });
  client.requestCode();
};

export const getTokens = (code: string, onComplete: (value: string) => void) => {
  postData('https://oauth2.googleapis.com/token', {
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URL,
    code,
    grant_type: 'authorization_code',
  }).then(response => {
    if (response && response.access_token && response.refresh_token) {
      localStorage.setItem('googleCredentials', JSON.stringify(response));
      onComplete(response);
    }
  });
};

async function postData(url: string, body: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  try {
    return await response.json();
  } catch {
    return;
  }
}

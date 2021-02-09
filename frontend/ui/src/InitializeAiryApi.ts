import {HttpClient} from 'httpclient';
import {getAuthToken} from './cookies';
import {env} from './env';
import {store} from './store';
import {logoutUserAction} from './actions/user';

const authToken = getAuthToken();

export const HttpClientInstance = new HttpClient(authToken, `//${env.API_HOST}`, error => {
  console.error('Unauthorized request, logging out user');
  console.error(error);

  store.dispatch(logoutUserAction());
});

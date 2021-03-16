import {HttpClient} from 'httpclient';
import {getAuthToken} from './cookies';
import {env} from './env';
import {store} from './store';
import {logoutUser} from './actions/user';

const authToken = getAuthToken();

export const HttpClientInstance = new HttpClient(`//${env.API_HOST}`, authToken, error => {
  console.error('Unauthorized request, logging out user');
  console.error(error);

  logoutUser()(store.dispatch);
});

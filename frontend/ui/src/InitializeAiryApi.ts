import {HttpClient} from 'httpclient';
import {env} from './env';

export const HttpClientInstance = new HttpClient(env.API_HOST, error => {
  console.error('Unauthorized request, logging out user');
  console.error(error);
});

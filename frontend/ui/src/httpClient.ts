import {HttpClient} from 'httpclient/src';
import {env} from './env';

export const HttpClientInstance = new HttpClient(env.API_HOST, (error, loginUrl) => {
  console.error(error);
  if (location.href != loginUrl) {
    location.replace(loginUrl);
  }
});

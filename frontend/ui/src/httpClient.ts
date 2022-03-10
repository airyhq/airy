import {HttpClient} from 'httpclient/src';
import {env} from './env';

export const apiHostUrl = env.API_HOST ?? `${location.protocol + '//' + location.host}`;

export const HttpClientInstance = new HttpClient(apiHostUrl, (error, loginUrl) => {
  console.error(error);
  if (location.href != loginUrl) {
    location.replace(loginUrl);
  }
});

import {HttpClient} from 'httpclient';
import {getAuthToken} from './cookies';
import {env} from './env';

const authToken = getAuthToken();

export const HttpClientInstance = new HttpClient(authToken, env.apiHost);

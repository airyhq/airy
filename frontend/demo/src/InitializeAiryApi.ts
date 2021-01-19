import {HttpClient} from 'httpclient';
import {getAuthToken} from './cookies';

const authToken = getAuthToken();

export const HttpClientInstance = new HttpClient(authToken);

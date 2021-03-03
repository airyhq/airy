import {UserPayload, LoginViaEmailRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.loginViaEmail = async function loginViaEmail(
  requestPayload: LoginViaEmailRequestPayload
) {
  const response: UserPayload = await this.doFetchFromBackend('users.login', requestPayload, {ignoreAuthToken: true});

  return {...camelcaseKeys(response), displayName: `${response.first_name} ${response.last_name}`};
};

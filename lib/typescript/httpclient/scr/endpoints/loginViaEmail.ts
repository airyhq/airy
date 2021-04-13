/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

import {LoginViaEmailRequestPayload} from './payload';
import {HttpClient} from '../../client';

export default HttpClient.prototype.loginViaEmail = async function loginViaEmail(
  requestPayload: LoginViaEmailRequestPayload
) {
  const response = await this.doFetchFromBackend('users.login', requestPayload, {ignoreAuthToken: true});

  return {...camelcaseKeys(response), displayName: `${response.first_name} ${response.last_name}`};
};

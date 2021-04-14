/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

import {ListTemplatesRequestPayload} from './payload';
import {HttpClient} from '../../client';

export default HttpClient.prototype.listTemplates = async function listTemplates(
  requestPayload: ListTemplatesRequestPayload
) {
  const response = await this.doFetchFromBackend('templates.list', {
    name: requestPayload.name,
    source: requestPayload.source,
  });

  return camelcaseKeys(response.data);
};

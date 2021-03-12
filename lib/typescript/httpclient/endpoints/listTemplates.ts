import {ListTemplatesRequestPayload, ListTemplatesPayload} from '../payload';
import {HttpClient} from '../client';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export default HttpClient.prototype.listTemplates = async function listTemplates(
  requestPayload: ListTemplatesRequestPayload
) {
  const response: ListTemplatesPayload = await this.doFetchFromBackend('templates.list', {
    name: requestPayload.name,
    source_type: requestPayload.sourceType,
  });

  return camelcaseKeys(response.data);
};

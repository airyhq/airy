import {ListTemplatesRequestPayload, ListTemplatesPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
import {HttpClient} from '../client';

export default HttpClient.prototype.listTemplates = async function listTemplates(
  requestPayload: ListTemplatesRequestPayload
) {
  const response: ListTemplatesPayload = await this.doFetchFromBackend('templates.list', requestPayload);

  return response;
};

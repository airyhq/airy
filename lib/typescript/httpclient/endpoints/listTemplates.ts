import {ListTemplatesRequestPayload, ListTemplatesPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.listTemplates = async function listTemplates(
  requestPayload: ListTemplatesRequestPayload
) {
  const response: ListTemplatesPayload = await this.doFetchFromBackend('templates.list', requestPayload);

  return response.data;
};

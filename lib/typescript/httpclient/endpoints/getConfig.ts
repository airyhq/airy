import {ConfigPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.sendMessages = async function getConfig() {
  const response: ConfigPayload = await this.doFetchFromBackend('client.config');
  return response;
};

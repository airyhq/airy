import {HttpClient} from '../client';

export default HttpClient.prototype.getConfig = async function getConfig() {
  return await this.doFetchFromBackend('client.config');
};

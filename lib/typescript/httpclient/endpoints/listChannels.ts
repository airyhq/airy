/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.listChannels = async function () {
  const response = await this.doFetchFromBackend('channels.list', {});

  return camelcaseKeys(response.data, {deep: true, stopPaths: ['metadata.userData']});
};

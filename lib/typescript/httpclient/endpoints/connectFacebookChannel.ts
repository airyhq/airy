import {ChannelPayload, ConnectChannelRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.connectFacebookChannel = async function (
  requestPayload: ConnectChannelRequestPayload
) {
  const response: ChannelPayload = await this.doFetchFromBackend('channels.connect', camelcaseKeys(requestPayload));

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.userData']});
};

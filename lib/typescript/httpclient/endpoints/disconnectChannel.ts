import {DisconnectChannelRequestPayload, ChannelsPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.disconnectChannel = async function(
  source: string,
  requestPayload: DisconnectChannelRequestPayload
) {
  const response: ChannelsPayload = await this.doFetchFromBackend(
    `channels.${source}.disconnect`,
    camelcaseKeys(requestPayload)
  );

  return camelcaseKeys(response.data, {deep: true, stopPaths: ['metadata.userData']});
};

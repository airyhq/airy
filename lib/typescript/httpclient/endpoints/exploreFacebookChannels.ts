import {ChannelsPayload, ExploreChannelRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.exploreFacebookChannels = async function (
  requestPayload: ExploreChannelRequestPayload
) {
  const response: ChannelsPayload = await this.doFetchFromBackend('facebook.channels.explore', requestPayload);

  return camelcaseKeys(response.data, {deep: true, stopPaths: ['metadata.userData']});
};

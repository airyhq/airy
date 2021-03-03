import {ChannelPayload, ConnectChannelFacebookRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.connectFacebookChannel = async function(
  requestPayload: ConnectChannelFacebookRequestPayload
) {
  const response: ChannelPayload = await this.doFetchFromBackend('channels.facebook.connect', {
    page_id: requestPayload.pageId,
    page_token: requestPayload.pageToken,
    name: requestPayload.name,
    image_url: requestPayload.imageUrl,
  });

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.userData']});
};

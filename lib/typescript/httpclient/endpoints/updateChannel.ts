import {ChannelPayload, UpdateChannelRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.updateChannel = async function(requestPayload: UpdateChannelRequestPayload) {
  const response: ChannelPayload = await this.doFetchFromBackend(`channels.update`, {
    channel_id: requestPayload.channelId,
    name: requestPayload.name,
    ...(requestPayload.imageUrl && {
      image_url: requestPayload.imageUrl,
    }),
  });

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.userData']});
};

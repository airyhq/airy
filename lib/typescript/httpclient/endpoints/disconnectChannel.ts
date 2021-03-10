import {DisconnectChannelRequestPayload} from '../payload';
import {HttpClient} from '../client';

export default HttpClient.prototype.disconnectChannel = async function (
  source: string,
  requestPayload: DisconnectChannelRequestPayload
) {
  await this.doFetchFromBackend(`channels.${source}.disconnect`, {
    channel_id: requestPayload.channelId,
  });

  return true;
};

import {DisconnectChannelRequestPayload} from './payload';
import {HttpClient} from '../../client';

export default HttpClient.prototype.disconnectChannel = function (requestPayload: DisconnectChannelRequestPayload) {
  return this.doFetchFromBackend(`channels.${requestPayload.source}.disconnect`, {
    channel_id: requestPayload.channelId,
  });
};

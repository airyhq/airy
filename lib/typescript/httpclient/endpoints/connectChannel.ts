import {doFetchFromBackend} from '../api';
import {ConnectChannelRequestPayload} from '../payload';
import {ChannelApiPayload} from '../payload/ChannelApiPayload';
import {connectChannelApiMapper} from '../mappers/connectChannelApiMapper';
import {channelMapper} from '../mappers/channelMapper';

export function connectChannel(requestPayload: ConnectChannelRequestPayload) {
  return doFetchFromBackend('channels.connect', connectChannelApiMapper(requestPayload))
    .then((response: ChannelApiPayload) => {
      const channel = channelMapper(response);
      return channel;
    })
    .catch((error: Error) => {
      return error;
    });
}

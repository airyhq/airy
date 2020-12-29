import {doFetchFromBackend} from '../api';
import { ConnectChannelRequestPayload, connectChannelApiMapper, ChannelApiPayload,channelMapper} from '../model';

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
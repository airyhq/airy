import {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {doFetchFromBackend} from '../../api/airyConfig';

import {
  Channel,
  ChannelApiPayload,
  ChannelsPayload,
  channelsMapper,
  channelMapper,
  connectChannelApiMapper,
  disconnectChannelApiMapper,
  ConnectChannelRequestPayload,
  ExploreChannelRequestPayload,
  DisconnectChannelRequestPayload,
} from '../../model/Channel';

const SET_CURRENT_CHANNELS = '@@channel/SET_CHANNELS';
const ADD_CHANNELS = '@@channel/ADD_CHANNELS';

export const setCurrentChannelsAction = createAction(SET_CURRENT_CHANNELS, resolve => (channels: Channel[]) =>
  resolve(channels)
);

export const addChannelsAction = createAction(ADD_CHANNELS, resolve => (channels: Channel[]) => resolve(channels));

export function getChannels() {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('channels.list')
      .then((response: ChannelsPayload) => {
        const channels = channelsMapper(response);
        dispatch(setCurrentChannelsAction(channels));
        return Promise.resolve(channels);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function exploreChannels(requestPayload: ExploreChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('channels.explore', requestPayload)
      .then((response: ChannelsPayload) => {
        const channels = channelsMapper(response, requestPayload.source);
        dispatch(addChannelsAction(channels));
        return Promise.resolve(channels);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function connectChannel(requestPayload: ConnectChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('channels.connect', connectChannelApiMapper(requestPayload))
      .then((response: ChannelApiPayload) => {
        const channel = channelMapper(response);
        dispatch(addChannelsAction([channel]));
        return Promise.resolve(channel);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function disconnectChannel(requestPayload: DisconnectChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('channels.disconnect', disconnectChannelApiMapper(requestPayload))
      .then((response: ChannelsPayload) => {
        const channels = channelsMapper(response);
        dispatch(setCurrentChannelsAction(channels));
        return Promise.resolve(channels);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

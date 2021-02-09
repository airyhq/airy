import {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {
  Channel,
  ConnectChannelRequestPayload,
  ExploreChannelRequestPayload,
  DisconnectChannelRequestPayload,
} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const SET_CURRENT_CHANNELS = '@@channel/SET_CHANNELS';
const ADD_CHANNELS = '@@channel/ADD_CHANNELS';
const ADD_CHANNEL = '@@channel/ADD_CHANNEL';
const REMOVE_CHANNEL = '@@channel/REMOVE_CHANNEL';

export const setCurrentChannelsAction = createAction(SET_CURRENT_CHANNELS, resolve => (channels: Channel[]) =>
  resolve(channels)
);

export const addChannelsAction = createAction(ADD_CHANNELS, resolve => (channels: Channel[]) => resolve(channels));

export const addChannelAction = createAction(ADD_CHANNEL, resolve => (channel: Channel) => resolve(channel));
export const removeChannelAction = createAction(REMOVE_CHANNEL, resolve => (channel: Channel) => resolve(channel));

export function listChannels() {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.listChannels()
      .then((response: Channel[]) => {
        dispatch(setCurrentChannelsAction(response));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function exploreChannels(requestPayload: ExploreChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.exploreFacebookChannels(requestPayload)
      .then((response: Channel[]) => {
        dispatch(addChannelsAction(response));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function connectChannel(requestPayload: ConnectChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.connectFacebookChannel(requestPayload)
      .then((response: Channel) => {
        dispatch(addChannelsAction([response]));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function disconnectChannel(source: string, requestPayload: DisconnectChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.disconnectChannel(source, requestPayload)
      .then((response: Channel[]) => {
        dispatch(setCurrentChannelsAction(response));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

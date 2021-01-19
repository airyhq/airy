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

export const setCurrentChannelsAction = createAction(SET_CURRENT_CHANNELS, resolve => (channels: Channel[]) =>
  resolve(channels)
);

export const addChannelsAction = createAction(ADD_CHANNELS, resolve => (channels: Channel[]) => resolve(channels));

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
    return HttpClientInstance.exploreChannels(requestPayload)
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
    return HttpClientInstance.connectChannel(requestPayload)
      .then((response: Channel) => {
        dispatch(addChannelsAction([response]));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function disconnectChannel(requestPayload: DisconnectChannelRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.disconnectChannel(requestPayload)
      .then((response: Channel[]) => {
        dispatch(setCurrentChannelsAction(response));
        return Promise.resolve(response);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

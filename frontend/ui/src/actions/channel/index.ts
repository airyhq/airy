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
const SET_CHANNEL = '@@channel/SET_CHANNEL';

export const setCurrentChannelsAction = createAction(SET_CURRENT_CHANNELS, resolve => (channels: Channel[]) =>
  resolve(channels)
);

export const addChannelsAction = createAction(ADD_CHANNELS, resolve => (channels: Channel[]) => resolve(channels));
export const setChannelAction = createAction(SET_CHANNEL, resolve => (channel: Channel) => resolve(channel));

export const listChannels = () => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.listChannels().then((response: Channel[]) => {
    dispatch(setCurrentChannelsAction(response));
    return Promise.resolve(response);
  });

export const exploreChannels = (requestPayload: ExploreChannelRequestPayload) => async (dispatch: Dispatch<any>) => {
  return HttpClientInstance.exploreFacebookChannels(requestPayload).then((response: Channel[]) => {
    dispatch(addChannelsAction(response));
    return Promise.resolve(response);
  });
};

export const connectChannel = (source: string, requestPayload: ConnectChannelRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.connectChannel(source, requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const disconnectChannel = (source: string, requestPayload: DisconnectChannelRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.disconnectChannel(source, requestPayload).then((response: Channel[]) => {
    dispatch(setCurrentChannelsAction(response));
    return Promise.resolve(response);
  });

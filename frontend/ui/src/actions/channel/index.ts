import _typesafe, {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {
  Channel,
  ConnectChannelFacebookRequestPayload,
  ExploreChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ConnectChatPluginRequestPayload,
  UpdateChannelRequestPayload,
} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

const SET_CURRENT_CHANNELS = '@@channel/SET_CHANNELS';
const ADD_CHANNELS = '@@channel/ADD_CHANNELS';
const SET_CHANNEL = '@@channel/SET_CHANNEL';
const DELETE_CHANNEL = '@@channel/DELETE_CHANNEL';

export const setCurrentChannelsAction = createAction(SET_CURRENT_CHANNELS, (channels: Channel[]) => channels)<
  Channel[]
>();

export const addChannelsAction = createAction(ADD_CHANNELS, (channels: Channel[]) => channels)<Channel[]>();
export const setChannelAction = createAction(SET_CHANNEL, (channel: Channel) => channel)<Channel>();
export const deleteChannelAction = createAction(DELETE_CHANNEL, (channelId: string) => channelId)<string>();

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

export const connectFacebookChannel = (requestPayload: ConnectChannelFacebookRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.connectFacebookChannel(requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const connectChannelTwilioSms = (requestPayload: ConnectChannelRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.connectTwilioSms(requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const connectChannelTwilioWhatsapp = (requestPayload: ConnectChannelRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.connectTwilioWhatsapp(requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const updateChannel = (requestPayload: UpdateChannelRequestPayload) => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.updateChannel(requestPayload).then((response: Channel) => {
    dispatch(setChannelAction(response));
    return Promise.resolve(response);
  });

export const disconnectChannel = (requestPayload: DisconnectChannelRequestPayload) => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.disconnectChannel(requestPayload).then(() => {
    dispatch(deleteChannelAction(requestPayload.channelId));
    return Promise.resolve(true);
  });

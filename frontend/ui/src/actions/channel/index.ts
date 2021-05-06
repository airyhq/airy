import _typesafe, {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

import {Channel} from 'model';

import {
  ConnectChannelFacebookRequestPayload,
  ExploreChannelRequestPayload,
  DisconnectChannelRequestPayload,
  ConnectChatPluginRequestPayload,
  ConnectTwilioSmsRequestPayload,
  ConnectTwilioWhatsappRequestPayload,
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

export const connectChatPlugin = (requestPayload: ConnectChatPluginRequestPayload) => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.connectChatPluginChannel(requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const connectTwilioSms = (requestPayload: ConnectTwilioSmsRequestPayload) => async (dispatch: Dispatch<any>) =>
  HttpClientInstance.connectTwilioSmsChannel(requestPayload).then((response: Channel) => {
    dispatch(addChannelsAction([response]));
    return Promise.resolve(response);
  });

export const connectTwilioWhatsapp = (requestPayload: ConnectTwilioWhatsappRequestPayload) => async (
  dispatch: Dispatch<any>
) =>
  HttpClientInstance.connectTwilioWhatsappChannel(requestPayload).then((response: Channel) => {
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

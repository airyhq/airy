import _, {combineReducers, Reducer} from 'redux';
import {User} from 'model';

import user from './user';
import config, {Config} from './config';
import channels, {ChannelsState} from './channels';
import {Webhook} from 'model/Webhook';
import webhooks from './webhooks';
import connector, {ConnectorsConfig} from './connector';

export * from './channels';
export * from './config';
export * from './connector';
export * from './user';

export type DataState = {
  user: User;
  channels: ChannelsState;
  config: Config;
  connector: ConnectorsConfig;
  webhooks: Webhook;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  channels,
  config,
  connector,
  webhooks,
});

export default reducers;

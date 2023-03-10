import _, {combineReducers, Reducer} from 'redux';
import {User} from 'model';

import user from './user';
import config, {Config} from './config';
import channels, {ChannelsState} from './channels';
import {Webhook} from 'model/Webhook';
import {Streams} from 'model/Streams';
import webhooks from './webhooks';
import connector, {ConnectorsConfig} from './connector';
import catalog, {CatalogConfig} from './catalog';
import streams from './streams';

export * from './channels';
export * from './config';
export * from './connector';
export * from './catalog';
export * from './user';
export * from './streams';

export type DataState = {
  user: User;
  channels: ChannelsState;
  config: Config;
  connector: ConnectorsConfig;
  catalog: CatalogConfig;
  webhooks: Webhook;
  streams: Streams;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  channels,
  config,
  connector,
  catalog,
  webhooks,
  streams,
});

export default reducers;

import _, {combineReducers, Reducer} from 'redux';
import {User} from 'model';

import user from './user';
import config, {Config} from './config';
import channels, {ChannelsState} from './channels';
import {Webhook} from 'model/Webhook';
import webhooks from './webhooks';

export * from './channels';
export * from './config';
export * from './user';

export type DataState = {
  user: User;
  channels: ChannelsState;
  config: Config;
  webhooks: Webhook;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  channels,
  config,
  webhooks,
});

export default reducers;

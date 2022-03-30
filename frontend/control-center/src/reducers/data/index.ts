import _, {combineReducers, Reducer} from 'redux';
import {User} from 'model';

import user from './user';
import config, {Config} from './config';
// import channels, {ChannelsState} from './channels';
import connectors, {ConnectorsState} from './connectors';

export * from './connectors';
export * from './config';
export * from './user';

export type DataState = {
  user: User;
  connectors: ConnectorsState;
  config: Config;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  connectors,
  config,
});

export default reducers;

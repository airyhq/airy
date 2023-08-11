import {createAction} from 'typesafe-actions';
import {SourceChannel} from 'model';

const SET_CURRENT_SOURCE_CHANNELS = '@@channel/SET_SOURCE_CHANNELS';

export const setCurrentSourceChannelsAction = createAction(
  SET_CURRENT_SOURCE_CHANNELS,
  (channels: SourceChannel[]) => channels
)<SourceChannel[]>();

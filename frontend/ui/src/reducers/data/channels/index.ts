import {ActionType, getType} from 'typesafe-actions';
import {Channel} from 'httpclient';
import * as actions from '../../../actions/channel';
import * as metadataActions from '../../../actions/metadata';
import {merge, omitBy} from 'lodash-es';

type Action = ActionType<typeof actions> | ActionType<typeof metadataActions>;

export interface ChannelsState {
  [channelId: string]: Channel;
}

const setChannel = (state: ChannelsState, channel: Channel) => ({
  ...state,
  [channel.id]: channel,
});

const channelsReducer = (state = {}, action: Action): ChannelsState => {
  switch (action.type) {
    case getType(metadataActions.setMetadataAction):
      if (action.payload.subject !== 'channel') {
        return state;
      }

      return {
        ...state,
        [action.payload.identifier]: {
          id: action.payload.identifier,
          ...state[action.payload.identifier],
          metadata: merge({}, state[action.payload.identifier]?.metadata, action.payload.metadata),
        },
      };
    case getType(actions.setCurrentChannelsAction):
      return action.payload.reduce(setChannel, {});
    case getType(actions.addChannelsAction):
      return action.payload.reduce(setChannel, state);
    case getType(actions.setChannelAction):
      return setChannel(state, action.payload);

    case getType(actions.updateChannelAction):
      return {
        ...state,
        [action.payload.id]: {
          id: action.payload.id,
          ...state[action.payload.id],
          metadata: merge({}, state[action.payload.id]?.metadata, action.payload.metadata),
        },
      };

    case getType(actions.deleteChannelAction):
      return omitBy(state, (_channel, channelId: string) => {
        return channelId == action.payload;
      });

    default:
      return state;
  }
};

export default channelsReducer;

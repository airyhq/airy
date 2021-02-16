import {ActionType, getType} from 'typesafe-actions';
import {Channel} from 'httpclient';
import * as actions from '../../../actions/channel';

type Action = ActionType<typeof actions>;

export interface ChannelsState {
  [channelId: string]: Channel;
}

const setChannel = (state: ChannelsState, channel: Channel) => ({
  ...state,
  [channel.id]: channel,
});

const channelsReducer = (state = {}, action: Action): ChannelsState => {
  switch (action.type) {
    case getType(actions.setCurrentChannelsAction):
      return action.payload.reduce(setChannel, {});
    case getType(actions.addChannelsAction):
      return action.payload.reduce(setChannel, state);
    case getType(actions.setChannelAction):
      return setChannel(state, action.payload);
    default:
      return state;
  }
};

export default channelsReducer;

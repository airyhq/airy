import {ActionType, getType} from 'typesafe-actions';
import {Channel} from '../../../model/Channel';
import * as actions from '../../../actions/channel';
import {unionWith} from 'lodash-es';

type Action = ActionType<typeof actions>;

export const initialState = [];

const mergeChannels = (channels: Channel[], newChannels: Channel[]) =>
  unionWith(newChannels, channels, (channelA: Channel, channelB: Channel) => {
    return channelA.sourceChannelId === channelB.sourceChannelId;
  });

const channelsReducer: any = (state = initialState, action: Action): Channel[] | {} => {
  switch (action.type) {
    case getType(actions.setCurrentChannelsAction):
      return action.payload;
    case getType(actions.addChannelsAction):
      return mergeChannels(state, action.payload);
    default:
      return state;
  }
};

export default channelsReducer;

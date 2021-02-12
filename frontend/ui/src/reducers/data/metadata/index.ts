import {ActionType, getType} from 'typesafe-actions';
import * as metadataAction from '../../../actions/metadata';
import {ChannelMetadata, Metadata, ConversationMetadata} from 'httpclient';
import {MetadataEvent} from '../../../../../../lib/typescript/httpclient/model';

type Action = ActionType<typeof metadataAction>;

export interface MetadataState {
  conversation: {
    [conversationId: string]: ConversationMetadata;
  };
  channel: {
    [channelId: string]: ChannelMetadata;
  };
  message: {
    [messageId: string]: Metadata;
  };
}

export const initialState = {
  channel: {},
  conversation: {},
  message: {},
};

function mergeEvent(state: MetadataState, {subject, identifier, metadata}: MetadataEvent) {
  return {
    ...state,
    [subject]: {
      ...state[subject],
      [identifier]: {
        ...state[subject][identifier],
        ...metadata,
      },
    },
  };
}

const metadataReducer: any = (state = initialState, action: Action): MetadataState => {
  switch (action.type) {
    case getType(metadataAction.setMetadataAction):
      return mergeEvent(state, action.payload);
    case getType(metadataAction.setMetadataListAction):
      return action.payload.reduce(mergeEvent, state);
    default:
      return state;
  }
};

export default metadataReducer;

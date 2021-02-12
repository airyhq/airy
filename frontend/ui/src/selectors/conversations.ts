import _, {createSelector} from 'reselect';
import {filter, reverse, sortBy, values} from 'lodash-es';
import {Conversation} from 'httpclient';
import {MergedConversation, StateModel} from '../reducers';
import {ConversationMap} from '../reducers/data/conversations';
import {ConversationRouteProps} from '../pages/Inbox';
import {WithConversationMetadata} from 'httpclient';

const addMetadataToConversation = (conversation, metadataState): WithConversationMetadata<MergedConversation> => {
  if (!conversation) {
    return;
  }
  return {
    ...conversation,
    metadata: metadataState.conversation[conversation.id],
  };
};

export const getCurrentConversation = createSelector(
  (state: StateModel, props: ConversationRouteProps) =>
    state.data.conversations.all.items[props.match.params.conversationId],
  (state: StateModel) => state.data.metadata,
  addMetadataToConversation
);

export const getCurrentMessages = (state: StateModel, props: ConversationRouteProps) =>
  state.data.messages.all[props.match.params.conversationId];

export const filteredConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.filtered.items,
  (conversations: ConversationMap) => Object.keys(conversations).map((cId: string) => ({...conversations[cId]}))
);

export const allConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.all.items,
  (state: StateModel) => state.data.metadata,
  (conversations: ConversationMap, metadataState): WithConversationMetadata<MergedConversation>[] =>
    Object.keys(conversations).map((cId: string) => ({...addMetadataToConversation(conversations[cId], metadataState)}))
);

export const newestConversationFirst = createSelector(allConversationSelector, conversations => {
  return reverse(
    sortBy(
      values(conversations),
      (conversation: Conversation) => conversation.lastMessage && conversation.lastMessage.sentAt
    )
  );
});

export const newestFilteredConversationFirst = createSelector(
  filteredConversationSelector,
  (conversations: Conversation[]) => {
    return reverse(
      sortBy(conversations, (conversation: Conversation) => conversation.lastMessage && conversation.lastMessage.sentAt)
    );
  }
);

export const isFilterActive = (state: StateModel) =>
  filter(Object.keys(state.data.conversations.filtered.currentFilter), element => element !== 'display_name').length >
  0;

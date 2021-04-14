import _, {createSelector} from 'reselect';
import {filter, pickBy, reverse, sortBy, values} from 'lodash-es';
import {Conversation} from 'model';
import {MergedConversation, StateModel} from '../reducers';
import {ConversationMap} from '../reducers/data/conversations';
import {ConversationRouteProps} from '../pages/Inbox';

export const getCurrentConversation = (state: StateModel, props: ConversationRouteProps) =>
  state.data.conversations.all.items[props.match.params.conversationId];

export const getCurrentMessages = (state: StateModel, props: ConversationRouteProps) =>
  state.data.messages.all[props.match.params.conversationId];

export const filteredConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.filtered.items,
  (conversations: ConversationMap) => Object.keys(conversations).map((cId: string) => ({...conversations[cId]}))
);

// Filter out conversations that only have metadata
export const allConversations = (state: StateModel): MergedConversation[] =>
  Object.values(
    pickBy(
      state.data.conversations.all.items,
      ({id, metadata, ...restConversation}) => Object.keys(restConversation).length > 1
    )
  );

export const newestConversationFirst = createSelector(allConversations, conversations => {
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

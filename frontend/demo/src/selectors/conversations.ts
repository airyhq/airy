import _, {createSelector} from 'reselect';
import {reverse, sortBy, values} from 'lodash-es';
import {Conversation} from '../model/Conversation';
import {StateModel} from '../reducers';
import {ConversationMap} from '../reducers/data/conversations';
import {MessageMap} from '../reducers/data/messages';

export const filteredConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.all.items,
  (conversations: ConversationMap) => Object.keys(conversations).map((cId: string) => ({...conversations[cId]}))
);

export const allConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.all.items,
  (conversations: ConversationMap) => Object.keys(conversations).map((cId: string) => ({...conversations[cId]}))
);

export const newestConversationFirst = createSelector(allConversationSelector, (conversations: Conversation[]) => {
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

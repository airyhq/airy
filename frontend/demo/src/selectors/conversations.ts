import _, {createSelector} from 'reselect';
import {reverse, sortBy, values} from 'lodash-es';
import {Conversation} from '../model/Conversation';
import {StateModel} from '../reducers';

export const filteredConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.all.items,
  (conversations) => Object.keys(conversations).map(cId => ({...conversations[cId]}))
);

export const allConversationSelector = createSelector(
  (state: StateModel) => state.data.conversations.all.items,  
  (conversations) => Object.keys(conversations).map(cId => ({...conversations[cId]}))
);

export const newestConversationFirst = createSelector(allConversationSelector, conversations => {
  return reverse(
    sortBy(values(conversations), (conversation: Conversation) => conversation.message && conversation.message.sent_at)
  );
});

// const filterConversationsByState = (conversations, state) => {
//   return conversations.filter(item => item.state === state);
// };

export const newestFilteredConversationFirst = createSelector(
  filteredConversationSelector,
  (conversations: Conversation[]) => {    
    return reverse(
      sortBy(
        conversations,
        (conversation: Conversation) => conversation.message && conversation.message.sent_at
      )
    );
  }
);

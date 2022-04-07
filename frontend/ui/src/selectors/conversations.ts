import {createSelector} from 'reselect';
import {filter, pickBy, reverse, sortBy, values} from 'lodash-es';
import {Conversation} from 'model';
import {MergedConversation, StateModel} from '../reducers';
import {ConversationFilter} from '../reducers/data/conversationsFilter';
import {ConversationMap} from '../reducers/data/conversations';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

export const getCurrentConversation = conversationId => (state: StateModel) =>
  state.data.conversations.all.items[conversationId];

export const getCurrentFilteredConversation = conversationId => (state: StateModel) =>
  state.data.conversations.filtered.items[conversationId];

export const getConversationSelector = conversationId => {
  const currentConversationFn = getCurrentConversation(conversationId);
  const currentFilteredConversationFn = getCurrentFilteredConversation(conversationId);
  return (state: StateModel) => {
    const currentConversation = currentConversationFn(state);
    const currentFilteredConversation = currentFilteredConversationFn(state);
    if (!currentConversation && !currentFilteredConversation) return undefined;
    return {...currentConversation, ...currentFilteredConversation};
  };
};

export const useCurrentConversation = () => {
  const {conversationId} = useParams();
  return useSelector(getConversationSelector(conversationId));
};

export const useCurrentMessages = () => {
  const {conversationId} = useParams();
  return useSelector((state: StateModel) => state.data.messages.all[conversationId]);
};

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
  (state: StateModel) => state.data.conversations.all.items,
  (state: StateModel) => state.data.conversations.filtered.items,
  (state: StateModel) => state.data.conversations.filtered.currentFilter,
  (conversationsMap: ConversationMap, filteredConversationsMap: ConversationMap, currentFilter: ConversationFilter) => {
    const conversations = Object.keys(conversationsMap).map((cId: string) => ({...conversationsMap[cId]}));
    const filteredConversations = Object.keys(filteredConversationsMap).map((cId: string) => ({
      ...filteredConversationsMap[cId],
    }));

    const updatedConversations: ConversationMap = {};

    filteredConversations.forEach((filteredConversation: Conversation) => {
      if (conversationsMap[filteredConversation.id]) {
        updatedConversations[filteredConversation.id] = conversationsMap[filteredConversation.id];
      } else {
        updatedConversations[filteredConversation.id] = filteredConversationsMap[filteredConversation.id];
      }
    });

    conversations.forEach((conversation: Conversation) => {
      if (!updatedConversations[conversation.id]) {
        updatedConversations[conversation.id] = conversation;
      }
    });

    const updatedFiltered = filter(updatedConversations, (conversation: Conversation) => {
      let isFulfilled = true;

      if (currentFilter.isStateOpen !== undefined) {
        if (currentFilter.isStateOpen) {
          isFulfilled = conversation.metadata.state === 'OPEN' || conversation.metadata.state === undefined;
        } else {
          isFulfilled = conversation.metadata.state === 'CLOSED';
        }
        if (!isFulfilled) return isFulfilled;
      }

      if (currentFilter.readOnly && isFulfilled) {
        isFulfilled = conversation.metadata.unreadCount === 0;
      } else if (currentFilter.unreadOnly) {
        isFulfilled = conversation.metadata.unreadCount > 0;
      }

      if (currentFilter.byTags && isFulfilled) {
        const conversationTags = Object.keys(conversation.metadata.tags || {}).map((id: string) => id);
        const filterTags = Object.keys(currentFilter.byTags).map((id: string) => currentFilter.byTags[id]);

        isFulfilled = filterTags.every(function (tag) {
          return conversationTags.indexOf(tag) >= 0;
        });
      }

      if (currentFilter.byChannels?.length > 0 && isFulfilled) {
        const channelId = conversation.channel.id;
        const filterChannel = Object.keys(currentFilter.byChannels).map((id: string) => currentFilter.byChannels[id]);

        isFulfilled = filterChannel.includes(channelId);
      }

      if (currentFilter.bySources?.length > 0 && isFulfilled) {
        const conversationSource = conversation.channel.source;
        const filterSource = Object.keys(currentFilter.bySources).map((id: string) => currentFilter.bySources[id]);

        isFulfilled = filterSource.includes(conversationSource);
      }

      if (currentFilter.displayName && isFulfilled) {
        const searchValue = currentFilter.displayName.toLowerCase();
        const displayName = conversation.metadata.contact.displayName.toLowerCase();

        isFulfilled = displayName.includes(searchValue);
      }

      return isFulfilled;
    });

    return reverse(
      sortBy(
        updatedFiltered,
        (conversation: Conversation) => conversation.lastMessage && conversation.lastMessage.sentAt
      )
    );
  }
);

export const isFilterActive = (state: StateModel) =>
  filter(Object.keys(state.data.conversations.filtered.currentFilter), element => element !== 'display_name').length >
  0;

import React, {useRef} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {debounce} from 'lodash-es';

import {
  newestConversationFirst,
  newestFilteredConversationFirst,
  useCurrentConversation,
} from '../../../selectors/conversations';
import {fetchNextConversationPage} from '../../../actions/conversations';
import {fetchNextFilteredPage} from '../../../actions/conversationsFilter';

import ConversationListHeader from '../ConversationListHeader';
import QuickFilter from '../QuickFilter';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';

import {StateModel} from '../../../reducers';

import styles from './index.module.scss';
import {cyConversationList} from 'handles';
import {useParams} from 'react-router-dom';

type ConversationListProps = ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  fetchNext: fetchNextConversationPage,
  fetchNextFiltered: fetchNextFilteredPage,
};

const mapStateToProps = (state: StateModel) => ({
  conversations: newestConversationFirst(state),
  filteredConversations: newestFilteredConversationFirst(state),
  conversationsPaginationData: state.data.conversations.all.paginationData,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
  currentFilter: state.data.conversations.filtered.currentFilter,
  user: state.data.user,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const {
    conversations,
    filteredConversations,
    conversationsPaginationData,
    filteredPaginationData,
    currentFilter,
    fetchNext,
    fetchNextFiltered,
  } = props;
  const conversationListRef = useRef(null);

  const {conversationId} = useParams();
  const hasFilter = Object.keys(currentFilter || {}).length > 0;
  const items = hasFilter ? filteredConversations : conversations;
  const paginationData = hasFilter ? filteredPaginationData : conversationsPaginationData;
  const isLoadingConversation = paginationData.loading;

  const hasPreviousMessages = () => {
    if (filteredPaginationData.previousCursor && filteredPaginationData.nextCursor === null) {
      return false;
    } else {
      return !!(conversationsPaginationData && conversationsPaginationData && conversationsPaginationData.nextCursor);
    }
  };

  const debouncedListPreviousConversations = debounce(() => {
    !hasFilter ? fetchNext() : fetchNextFiltered();
  }, 200);

  const handleScroll = debounce(
    () => {
      if (!conversationListRef) {
        return;
      }

      if (
        hasPreviousMessages() &&
        !isLoadingConversation &&
        conversationListRef &&
        conversationListRef.current &&
        conversationListRef.current.scrollHeight - conversationListRef.current.scrollTop ===
          conversationListRef.current.clientHeight
      ) {
        debouncedListPreviousConversations();
      }
    },
    100,
    {leading: true}
  );

  return (
    <section className={styles.conversationListContainerContacts}>
      <div className={styles.conversationListContainer} data-cy={cyConversationList}>
        <section className={styles.conversationListContainerFilterBox}>
          <ConversationListHeader />
          <QuickFilter />
        </section>
      </div>
      <section className={styles.conversationListContactList} onScroll={handleScroll} ref={conversationListRef}>
        <div className={styles.conversationListPaginationWrapper}>
          {!items.length && !isLoadingConversation ? (
            <NoConversations conversations={conversations.length} filterSet={!!Object.keys(currentFilter).length} />
          ) : (
            <>
              {filteredConversations &&
                filteredConversations.map(conversation => (
                  <ConversationListItem
                    key={conversation.id}
                    conversation={conversation}
                    active={conversation.id === conversationId}
                  />
                ))}
            </>
          )}
        </div>
      </section>
    </section>
  );
};

export default connector(ConversationList);

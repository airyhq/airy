import React, {createRef, useRef} from 'react';
import {withRouter} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import {debounce, isEmpty} from 'lodash-es';

import {newestConversationFirst, newestFilteredConversationFirst} from '../../../selectors/conversations';
import {fetchNextConversationPage} from '../../../actions/conversations';
import {fetchNextFilteredPage} from '../../../actions/conversationsFilter';

import ConversationListHeader from '../ConversationListHeader';
import QuickFilter from '../QuickFilter';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';

import {MergedConversation, StateModel} from '../../../reducers';

import styles from './index.module.scss';
import {ConversationRouteProps} from '../index';

type ConversationListProps = ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  fetchNext: fetchNextConversationPage,
  fetchNextFiltered: fetchNextFilteredPage,
};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => ({
  currentConversationId: ownProps.match.params.conversationId,
  conversations: newestConversationFirst(state),
  filteredConversations: newestFilteredConversationFirst(state),
  conversationsPaginationData: state.data.conversations.all.paginationData,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
  currentFilter: state.data.conversations.filtered.currentFilter,
  user: state.data.user,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const {currentConversationId} = props;
  const listRef: any = createRef();
  const conversationListRef = createRef<HTMLDivElement>();

  const renderConversationItem = (conversation: MergedConversation, style: React.CSSProperties) => {
   
    if (conversation == null) {
      return <div />;
    }
    return (
      <ConversationListItem
        style={style}
        key={conversation.id}
        conversation={conversation}
        active={conversation.id === currentConversationId}
      />
    );
  };

 
  const {
    conversations,
    filteredConversations,
    conversationsPaginationData,
    filteredPaginationData,
    currentFilter,
    fetchNext,
    fetchNextFiltered,
  } = props;

  console.log('conversations', conversations)
  console.log('filteredConversations', filteredConversations)

  const hasFilter = Object.keys(currentFilter || {}).length > 0;
  const items = hasFilter ? filteredConversations : conversations;
  const paginationData = hasFilter ? filteredPaginationData : conversationsPaginationData;

  const loading = paginationData.loading;

  // const isLoadingConversation = () => {
  //   return conversation && conversation.paginationData && conversation.paginationData.loading;
  // };

  const hasPreviousMessages = () => {
    return !!(conversationsPaginationData && conversationsPaginationData && conversationsPaginationData.nextCursor);
  };

  const debouncedListPreviousConversations = debounce(() => {
    console.log('hasFilter', hasFilter)

    if(!hasFilter){
      fetchNext();

    } else {
      fetchNextFilteredPage()
    }
  }, 200);

  //

  const handleScroll = debounce(
    () => {

      console.log('conversationListRef', conversationListRef)
      console.log('hasPreviousMessages()', hasPreviousMessages())
      console.log('scrollTop', conversationListRef && conversationListRef.current && conversationListRef.current.scrollTop)
      console.log('scrollHeight', conversationListRef && conversationListRef.current && conversationListRef.current.scrollHeight)
      console.log('clientHeight', conversationListRef && conversationListRef.current && conversationListRef.current.clientHeight)

      

      if (!conversationListRef) {
        return;
      }

      if (
        hasPreviousMessages() &&
        conversationListRef &&
        conversationListRef.current &&
        (conversationListRef.current.scrollHeight - conversationListRef.current.scrollTop) === conversationListRef.current.clientHeight
      ) {
        debouncedListPreviousConversations()
      }
    },
    100,
    {leading: true}
  );

  return (
    <section className={styles.conversationListContainerContacts}>
      <div className={styles.conversationListContainer}>
        <section className={styles.conversationListContainerFilterBox}>
          <ConversationListHeader />
          <QuickFilter />
        </section>
      </div>
      <section className={styles.conversationListContactList} onScroll={handleScroll} ref={conversationListRef}>
      {!items.length && !loading ? (
              <NoConversations conversations={conversations.length} filterSet={!!Object.keys(currentFilter).length} />
            ) : (
              <>
              {filteredConversations && filteredConversations.map(conversation => (
                   <ConversationListItem
                   style={styles}
                   key={conversation.id}
                   conversation={conversation}
                   active={conversation.id === currentConversationId}
                 />
              ))}
              </>
            )}

      </section>
    </section>
  );
};

export default withRouter(connector(ConversationList));

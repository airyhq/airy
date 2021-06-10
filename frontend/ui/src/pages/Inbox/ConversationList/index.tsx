import React, {createRef} from 'react';
import {withRouter, matchPath} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import {isEqual} from 'lodash-es';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

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

// ownProps.match.params.conversationId,

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => {
  const match: any = matchPath(ownProps.location.pathname, {
    path: '/inbox/conversations/:id',
  });

  //console.log('match', match && match.params.id)

  return {
    currentConversationId: ownProps.match.params.conversationId,
    conversations: newestConversationFirst(state),
    filteredConversations: newestFilteredConversationFirst(state),
    conversationsPaginationData: state.data.conversations.all.paginationData,
    filteredPaginationData: state.data.conversations.filtered.paginationData,
    currentFilter: state.data.conversations.filtered.currentFilter,
    user: state.data.user,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const listRef: any = createRef();
  const {currentConversationId} = props;

  const renderConversationItem = (conversation: MergedConversation, style: React.CSSProperties) => {
    console.log('convItem - active', conversation.id === currentConversationId);
    console.log('convItem conversation.id', conversation.id);
    console.log('currentConversationId', currentConversationId);

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

  const renderConversationList = () => {
    const {
      conversations,
      filteredConversations,
      conversationsPaginationData,
      filteredPaginationData,
      currentFilter,
      fetchNext,
      fetchNextFiltered,
    } = props;

    //console.log('props', props)

    const hasFilter = Object.keys(currentFilter || {}).length > 0;
    const items = hasFilter ? filteredConversations : conversations;
    const paginationData = hasFilter ? filteredPaginationData : conversationsPaginationData;

    const hasMoreData = paginationData.nextCursor && paginationData.nextCursor.length > 0;
    const loading = paginationData.loading;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!loading) {
        hasFilter ? fetchNextFiltered() : fetchNext();
      }
      return Promise.resolve(true);
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
        {({onItemsRendered, ref}) => (
          <div className={styles.conversationListPaginationWrapper}>
            {!items.length && !loading ? (
              <NoConversations conversations={conversations.length} filterSet={!!Object.keys(currentFilter).length} />
            ) : (
              <ResizableWindowList
                ref={listRef}
                infiniteLoaderRef={ref}
                itemCount={itemCount}
                itemSize={115}
                width={'100%'}
                onItemsRendered={onItemsRendered}>
                {({index, style}) => renderConversationItem(items[index], style)}
              </ResizableWindowList>
            )}
          </div>
        )}
      </InfiniteLoader>
    );
  };

  return (
    <section className={styles.conversationListContainerContacts}>
      <div className={styles.conversationListContainer}>
        <section className={styles.conversationListContainerFilterBox}>
          <ConversationListHeader />
          <QuickFilter />
        </section>
      </div>
      <section className={styles.conversationListContactList}>{renderConversationList()}</section>
    </section>
  );
};

// currentConversationId: match && match.id,
// conversations: newestConversationFirst(state),
// filteredConversations: newestFilteredConversationFirst(state),
// conversationsPaginationData: state.data.conversations.all.paginationData,
// filteredPaginationData: state.data.conversations.filtered.paginationData,
// currentFilter: state.data.conversations.filtered.currentFilter,
// user: state.data.user,

const propsAreEqual = (prevProps, nextProps) => {
  console.log('prevProps - ConvList', prevProps);
  console.log('nextProps - ConvList', nextProps);
  // console.log('prevProps.location.key !== nextProps.location.key', prevProps.location.key !== nextProps.location.key)
  // console.log('isEqual conv', isEqual(prevProps.conversations, nextProps.conversations))
  // isEqual(prevProps.currentConversationId, nextProps.currentConversationId) &&
  // isEqual(prevProps.currentConversationId, nextProps.currentConversationId) &&
  // isEqual(prevProps.currentConversationId, nextProps.currentConversationId) &&
  if (
    prevProps.history.location.pathname === nextProps.history.location.pathname &&
    isEqual(prevProps.conversations, nextProps.conversations) &&
    isEqual(prevProps.filteredConversations, nextProps.filteredConversations) &&
    isEqual(prevProps.conversationsPaginationData, nextProps.conversationsPaginationData) &&
    isEqual(prevProps.currentFilter, nextProps.currentFilter) &&
    isEqual(prevProps.user, nextProps.user) &&
    prevProps.history.location.key === nextProps.history.location.key &&
    prevProps.location.key !== nextProps.location.key
  ) {
    console.log('convList - true');
    return true;
  }

  console.log('isEqual convList', isEqual(prevProps, nextProps));

  return isEqual(prevProps, nextProps);
};

export default withRouter(connector(React.memo(ConversationList, propsAreEqual)));

{
  /* <ResizableWindowList
                ref={listRef}
                infiniteLoaderRef={ref}
                itemCount={itemCount}
                itemSize={115}
                width={'100%'}
                onItemsRendered={onItemsRendered}>
                {({index, style}) => renderConversationItem(items[index], style)}
              </ResizableWindowList> */
}

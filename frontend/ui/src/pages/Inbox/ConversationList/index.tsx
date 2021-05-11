import React, {createRef} from 'react';
import {withRouter} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

import {newestConversationFirst, newestFilteredConversationFirst} from '../../../selectors/conversations';
import {listNextConversations} from '../../../actions/conversations';

import ConversationListHeader from '../ConversationListHeader';
import ConversationsFilter from '../ConversationsFilter';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {SimpleLoader} from 'components';

import {MergedConversation, StateModel} from '../../../reducers';

import styles from './index.module.scss';
import {ConversationRouteProps} from '../index';

type ConversationListProps = ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  listNextConversations,
};

const mapStateToProps = (state: StateModel, ownProps: ConversationRouteProps) => ({
  currentConversationId: ownProps.match.params.conversationId,
  conversations: newestConversationFirst(state),
  filteredConversations: newestFilteredConversationFirst(state),
  conversationsPaginationData: state.data.conversations.all.paginationData,
  filteredPaginationData: state.data.conversations.filtered.paginationData,
  currentFilter: state.data.conversations.filtered.currentFilter,
  loading: state.data.conversations.all.paginationData.loading,
  user: state.data.user,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const listRef: any = createRef();

  const renderConversationItem = (conversation: MergedConversation, style: React.CSSProperties) => {
    const {currentConversationId} = props;
    if (conversation == null) {
      return (
        <div className="conversationListLoading" style={{...style, textAlignLast: 'center', marginTop: '24px'}}>
          <SimpleLoader />
        </div>
      );
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
      loading,
      listNextConversations,
    } = props;

    const hasFilter = Object.keys(currentFilter || {}).length > 0;
    const items = hasFilter ? filteredConversations : conversations;
    const paginationData = hasFilter ? filteredPaginationData : conversationsPaginationData;

    const hasMoreData = paginationData.nextCursor && paginationData.nextCursor.length > 0;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!paginationData.loading) {
        hasFilter ? listNextConversations() : listNextConversations();
      }
      return Promise.resolve(true);
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
        {({onItemsRendered, ref}) => (
          <div className={styles.conversationListPaginationWrapper}>
            {!items.length && !loading ? (
              <NoConversations />
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

  const resizeList = () => {
    //TODO
  };

  return (
    <section className={styles.conversationListContainerContacts}>
      <div className={styles.conversationListContainer}>
        <section className={styles.conversationListContainerFilterBox}>
          <ConversationListHeader onFilterVisibilityChanged={() => resizeList()} />
          <ConversationsFilter />
        </section>
      </div>
      <section className={styles.conversationListContactList}>{renderConversationList()}</section>
    </section>
  );
};

export default withRouter(connector(ConversationList));

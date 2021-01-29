import React, {createRef} from 'react';
import {withRouter, matchPath, RouteComponentProps, match} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

import {newestConversationFirst, newestFilteredConversationFirst} from '../../../selectors/conversations';
import {listNextConversations} from '../../../actions/conversations';

import ConversationListHeader from '../ConversationListHeader';
import ConversationsFilter from '../ConversationsFilter';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {SimpleLoader} from '@airyhq/components';

import {StateModel} from '../../../reducers';
import {Conversation} from 'httpclient';

import styles from './index.module.scss';

type ConversationListProps = ConnectedProps<typeof connector>;

type MatchParams = {
  id: string;
};

const mapDispatchToProps = {
  listNextConversations,
};

const mapStateToProps = (state: StateModel, ownProps: RouteComponentProps) => {
  const match: match<MatchParams> = matchPath(ownProps.history.location.pathname, {
    path: '/inbox/conversations/:id',
  });

  return {
    currentConversationId: match && match.params.id,
    conversations: newestConversationFirst(state),
    filteredConversations: newestFilteredConversationFirst(state),
    conversationsMetadata: state.data.conversations.all.metadata,
    filteredMetadata: state.data.conversations.filtered.metadata,
    currentFilter: state.data.conversations.filtered.currentFilter,
    loading: state.data.conversations.all.metadata.loading,
    user: state.data.user,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const listRef: any = createRef();

  const renderConversationItem = (conversation: Conversation, style: React.CSSProperties) => {
    const {currentConversationId} = props;
    if (conversation == null) {
      return (
        <div className="conversationListLoading" style={style}>
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
      conversationsMetadata,
      filteredMetadata,
      currentFilter,
      loading,
      listNextConversations,
    } = props;

    const hasFilter = Object.keys(currentFilter || {}).length > 0;
    const items = hasFilter ? filteredConversations : conversations;
    const metadata = hasFilter ? filteredMetadata : conversationsMetadata;

    const {next_cursor: nextCursor} = conversationsMetadata;

    const items = conversations;
    const metadata = conversationsMetadata;
    const hasMoreData = nextCursor && nextCursor.length > 0;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!metadata.loading) {
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
          <ConversationListHeader />
          <ConversationsFilter onFilterVisibilityChanged={() => resizeList()} />
        </section>
      </div>
      <section className={styles.conversationListContactList}>{renderConversationList()}</section>
    </section>
  );
};

export default withRouter(connector(ConversationList));

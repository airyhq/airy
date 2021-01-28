import React, {CSSProperties, RefObject} from 'react';
import {withRouter, matchPath, RouteComponentProps, match} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

import {newestConversationFirst} from '../../../selectors/conversations';
import {listNextConversations} from '../../../actions/conversations';

import ConversationListHeader from '../ConversationListHeader';
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
    conversationsPaginationData: state.data.conversations.all.paginationData,
    loading: state.data.conversations.all.paginationData.loading,
    user: state.data.user,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationList = (props: ConversationListProps) => {
  const listRef: RefObject<any> = React.createRef();

  const renderConversationItem = (conversation: Conversation, style: CSSProperties) => {
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
    const {conversations, conversationsPaginationData, loading, listNextConversations} = props;

    const {next_cursor: nextCursor} = conversationsPaginationData;

    const items = conversations;
    const paginationData = conversationsPaginationData;
    const hasMoreData = nextCursor && nextCursor.length > 0;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!paginationData.loading) {
        listNextConversations();
      }
      return Promise.resolve(true);
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
        {({onItemsRendered}) => (
          <div className={styles.conversationListPaginationWrapper}>
            {!items.length && !loading ? (
              <NoConversations />
            ) : (
              <ResizableWindowList
                ref={listRef}
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
        </section>
      </div>
      <section className={styles.conversationListContactList}>{renderConversationList()}</section>
    </section>
  );
};

export default withRouter(connector(ConversationList));

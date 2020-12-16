import React, {CSSProperties, RefObject} from 'react';
import {withRouter, matchPath, RouteComponentProps} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

import {newestConversationFirst} from '../../../selectors/conversations';
import {fetchNextConversations} from '../../../actions/conversations';

import ConversationListHeader from '../ConversationListHeader';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';
import {SimpleLoader} from '@airyhq/components';

import {StateModel} from '../../../reducers';
import {Conversation} from '../../../model/Conversation';

import './index.scss';

type ConversationListProps = ConnectedProps<typeof connector>;

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
    const {conversations, conversationsMetadata, loading} = props;

    const items = conversations;
    const metadata = conversationsMetadata;
    const hasMoreData = metadata.next_cursor && metadata.next_cursor.length > 0;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!metadata.loading) {
        fetchNextConversations();
      }
      return Promise.resolve(true);
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
        {({onItemsRendered, ref}) => (
          <div className="conversationListPaginationWrapper">
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
    <section className="conversationListContainerContacts">
      <div className="conversationListContainer">
        <section className="conversationListContainerFilterBox">
          <ConversationListHeader />
        </section>
      </div>
      <section className="conversationListContactList">{renderConversationList()}</section>
    </section>
  );
};

const mapDispatchToProps = {
  fetchNextConversations,
};

const mapStateToProps = (state: StateModel, ownProps: RouteComponentProps) => {
  const match: any = matchPath(ownProps.history.location.pathname, {
    path: '/inbox/conversations/:id',
  });

  return {
    currentConversationId: match && match.params.id,
    conversations: newestConversationFirst(state),
    conversationsMetadata: state.data.conversations.all.metadata,
    loading: state.data.conversations.all.metadata.loading,
    user: state.data.user,
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withRouter(connector(ConversationList));

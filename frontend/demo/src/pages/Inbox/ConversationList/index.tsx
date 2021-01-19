import React, {createRef} from 'react';
import {withRouter, matchPath, RouteComponentProps, match} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';
import {VariableSizeList as List} from 'react-window';


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

import './index.scss';

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
    const {conversations, filteredConversations, conversationsMetadata, filteredMetadata, loading, listNextConversations} = props;

    const items = filteredMetadata.loaded ? filteredConversations : conversations;;
    const metadata = filteredMetadata.loaded ? filteredMetadata : conversationsMetadata;
    const hasMoreData = metadata.nextCursor && metadata.nextCursor.length > 0;

    const isItemLoaded = (index: number) => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!metadata.loading) {
        listNextConversations();
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

  /////////

  const doResizeList = () => {
    if (listRef.current) {
      listRef.current.resizeToFit();
    }
  };

  const resizeList = () => {
    /*
     This makes sure the div is resized and fit to the height of the
     final size of the conversation list. Otherwise it would have two
     scrollbars. One for the content of the conversation list and one for
     the outer div that contains the conversation list. Sadly on some
     render engine 20ms is not enough, but 200 works fine. BUT we want
     to remove the scrollbar as soon as possible to remove flicker. Because
     of that we calculate it twice, the 2nd one just to be sure it is really
     gone even on slower machines.
    */
    setTimeout(doResizeList, 20);
    setTimeout(doResizeList, 200);
  };

  ////////

  return (
    <section className="conversationListContainerContacts">
      <div className="conversationListContainer">
        <section className="conversationListContainerFilterBox">
          <ConversationListHeader />
          <ConversationsFilter onFilterVisibilityChanged={() => resizeList()} />
        </section>
      </div>
      <section className="conversationListContactList">{renderConversationList()}</section>
    </section>
  );
};

export default withRouter(connector(ConversationList));

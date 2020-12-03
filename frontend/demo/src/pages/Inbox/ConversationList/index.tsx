import React, {Component, RefObject} from 'react';
import {withRouter, matchPath, Redirect} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';

import InfiniteLoader from 'react-window-infinite-loader';
import ResizableWindowList from '../../../components/ResizableWindowList';

import {newestConversationFirst, newestFilteredConversationFirst} from '../../../selectors/conversations';
import {isEqual} from 'lodash-es';

import ConversationListHeader from '../ConversationListHeader';
import ConversationListItem from '../ConversationListItem';
import NoConversations from '../NoConversations';

import './index.scss';
import {SimpleLoader} from '@airyhq/components';
import {StateModel} from '../../../reducers';

const getItems = props => {
  const {conversations} = props;
  return conversations;
};

const mapDispatchToProps = {
  // fetchNextConversations,
  // fetchNextFilteredConversations,
};

const mapStateToProps = (state: StateModel, ownProps) => {
  /*
  This component is outside of the path of the message view and doesn't
  have the params in its props. This will fetch them from the URL.
  Not a super nice solution, I am open to other suggestions :)
  */
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

type Props = ConnectedProps<typeof connector>;

class ConversationList extends Component<Props, null> {
  itemsLoaded;

  listRef: RefObject<any>;

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    this.listRef.current && this.listRef.current.resetSizeCache();

    const items = getItems(prevProps);
    const nextItems = getItems(this.props);

    if (items.length < nextItems.length && this.itemsLoaded) {
      this.itemsLoaded();
    }
  }

  renderConversationItem(conversation, style) {
    const {currentConversationId} = this.props;
    if (conversation == null) {
      return (
        <div className="ConversationList-Loading" style={style}>
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
  }

  hasDifferences(list, nextList) {
    if (list.length !== nextList.length) {
      return true;
    }

    for (let i = 0; i < list.length; i++) {
      const first = Object.assign({}, list[i], {metadata: undefined});
      const second = Object.assign({}, nextList[i], {metadata: undefined});

      if (!isEqual(first, second)) {
        return true;
      }
    }

    return false;
  }

  /**
   * This limits the re-rendering of this component to changes in some key values
   * of the conversation lists. Changes in the metadata are ignored.
   *
   * This reduces the flicker of the list when updating parts that are not used to
   * display the card.
   */
  shouldComponentUpdate(nextProps) {
    return (
      this.props.currentConversationId !== nextProps.currentConversationId ||
      this.hasDifferences(this.props.conversations, nextProps.conversations) ||
      isEqual(this.props.conversationsMetadata, nextProps.conversationsMetadata)
    );
  }

  renderConversationList() {
    const {conversations, conversationsMetadata, loading} = this.props;

    const items = conversations;
    const metadata = conversationsMetadata;
    const hasMoreData = metadata.next_cursor && metadata.next_cursor.length > 0;

    const isItemLoaded = index => index < items.length;
    const itemCount = hasMoreData ? items.length + 1 : items.length;
    const loadMoreItems = () => {
      if (!metadata.loading) {
        // hasFilter
        //   ? fetchNextFilteredConversations(getOrganizationId(this.props.user))
        //   : fetchNextConversations(getOrganizationId(this.props.user));
      }

      return new Promise(resolve => {
        this.itemsLoaded = resolve;
      });
    };

    return (
      <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
        {({onItemsRendered, ref}) => (
          <div className="ConversationList-PaginationWrapper">
            {!items.length && !loading ? (
              <NoConversations />
            ) : (
              <ResizableWindowList
                ref={this.listRef}
                infiniteLoaderRef={ref}
                itemCount={itemCount}
                itemSize={115}
                width={'100%'}
                onItemsRendered={onItemsRendered}>
                {({index, style}) => this.renderConversationItem(items[index], style)}
              </ResizableWindowList>
            )}
          </div>
        )}
      </InfiniteLoader>
    );
  }

  doResizeList = () => {
    if (this.listRef.current) {
      this.listRef.current.resizeToFit();
    }
  };

  resizeList = () => {
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
    setTimeout(this.doResizeList, 20);
    setTimeout(this.doResizeList, 200);
  };

  render() {
    // if (!this.props.currentConversationId && this.props.conversations.length !== 0) {
    //   return <Redirect to={INBOX_ROUTE} />;
    // }
    return (
      <section className="ConversationList-ContainerContacts">
        <div className="ConversationList-Container">
          <section className="ConversationList-ContainerFilterBox">
            <ConversationListHeader />
          </section>
        </div>
        <section className="ConversationList-ContactList">{this.renderConversationList()}</section>
      </section>
    );
  }
}

export default withRouter(connector(ConversationList));

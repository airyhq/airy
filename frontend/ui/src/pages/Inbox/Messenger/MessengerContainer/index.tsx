import React from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from '../../../../assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import MessageInput from '../../MessageInput';
import {getCurrentConversation} from '../../../../selectors/conversations';

const mapStateToProps = (state: StateModel, ownProps) => {
  return {
    conversations: state.data.conversations.all.items,
    currentConversation: getCurrentConversation(state, ownProps),
  };
};

const connector = connect(mapStateToProps);

type MessengerContainerProps = ConnectedProps<typeof connector>;

const MessengerContainer = ({conversations, currentConversation}: MessengerContainerProps) => (
  <>
    <div className={styles.messengerContainer}>
      {!conversations ? (
        <div className={styles.emptyState}>
          <h1>Your conversations will appear here as soon as a contact messages you.</h1>
          <p>Airy Messenger only shows new conversations from the moment you connect at least one channel.</p>
          <EmptyStateImage />
        </div>
      ) : (
        <div className={styles.messageDisplay}>
          <MessageList />
          {currentConversation && <MessageInput channelSource={currentConversation.channel.source} />}
        </div>
      )}
    </div>

    {currentConversation && <ConversationMetadata />}
  </>
);

export default withRouter(connector(MessengerContainer));

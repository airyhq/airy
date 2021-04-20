import React, {useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from 'assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import ConversationHeader from '../ConversationHeader';
import MessageInput from '../../MessageInput';
import {allConversations, getCurrentConversation} from '../../../../selectors/conversations';
import {Source, Suggestions} from 'model';

const mapStateToProps = (state: StateModel, ownProps) => ({
  conversations: allConversations(state),
  currentConversation: getCurrentConversation(state, ownProps),
});

const connector = connect(mapStateToProps);

type MessengerContainerProps = ConnectedProps<typeof connector>;

const MessengerContainer = ({conversations, currentConversation}: MessengerContainerProps) => {
  const [suggestions, showSuggestedReplies] = useState<Suggestions>(null);

  const hideSuggestedReplies = () => {
    showSuggestedReplies(null);
  };

  return (
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
            {currentConversation && <ConversationHeader />}
            <MessageList showSuggestedReplies={showSuggestedReplies} />
            {currentConversation && (
              <MessageInput
                suggestions={suggestions}
                showSuggestedReplies={showSuggestedReplies}
                hideSuggestedReplies={hideSuggestedReplies}
                source={currentConversation.channel.source as Source}
              />
            )}
          </div>
        )}
      </div>

      {currentConversation && <ConversationMetadata />}
    </>
  );
};

export default withRouter(connector(MessengerContainer));

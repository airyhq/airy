import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from 'assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import ConversationHeader from '../ConversationHeader';
import MessageInput from '../../MessageInput';
import {allConversations, getConversation} from '../../../../selectors/conversations';
import {Source, Suggestions} from 'model';
import {getConversationInfo} from '../../../../actions';

const mapStateToProps = (state: StateModel, ownProps) => ({
  conversations: allConversations(state),
  currentConversation: getConversation(state, ownProps),
});

const mapDispatchToProps = {
  getConversationInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type MessengerContainerProps = ConnectedProps<typeof connector> & RouteComponentProps<{conversationId: string}>;

const MessengerContainer = ({
  conversations,
  currentConversation,
  getConversationInfo,
  match,
}: MessengerContainerProps) => {
  const [suggestions, showSuggestedReplies] = useState<Suggestions>(null);

  useEffect(() => {
    if (!currentConversation && match.params.conversationId) {
      getConversationInfo(match.params.conversationId);
    }
  }, [currentConversation, match.params.conversationId]);

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
            {currentConversation && (
              <>
                <ConversationHeader />
                <MessageList showSuggestedReplies={showSuggestedReplies} />
                <MessageInput
                  suggestions={suggestions}
                  showSuggestedReplies={showSuggestedReplies}
                  hideSuggestedReplies={hideSuggestedReplies}
                  source={currentConversation.channel.source as Source}
                />
              </>
            )}
          </div>
        )}
      </div>

      {currentConversation && <ConversationMetadata />}
    </>
  );
};

export default withRouter(connector(MessengerContainer));

import React, {useEffect, useState} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {useParams} from 'react-router-dom';

import {StateModel} from '../../../../reducers';
import MessageList from '../MessageList';
import {ReactComponent as EmptyStateImage} from '../../../../assets/images/empty-state/inbox-empty-state.svg';
import styles from './index.module.scss';
import ConversationMetadata from '../ConversationMetadata';
import MessageInput from '../../MessageInput';

const mapStateToProps = (state: StateModel) => {
  return {
    conversations: state.data.conversations.all.items,
  };
};

const connector = connect(mapStateToProps, null);

type MessengerContainerProps = ConnectedProps<typeof connector>;

const MessengerContainer = (props: MessengerContainerProps) => {
  const {conversations} = props;
  const {conversationId} = useParams<{conversationId: string}>();
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    setCurrentConversation(conversations[conversationId]);
  }, [conversationId, conversations]);

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
            <MessageList conversation={currentConversation} />
            <MessageInput channelSource={currentConversation && currentConversation.channel.source} />
          </div>
        )}
      </div>
      <ConversationMetadata conversation={currentConversation} />
    </>
  );
};

export default connector(MessengerContainer);

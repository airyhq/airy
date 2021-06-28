import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';
import {Avatar, SourceMessagePreview} from 'render';

import {formatTimeOfMessage} from '../../../services/format/date';

import {MergedConversation, StateModel} from '../../../reducers';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {readConversations, conversationState} from '../../../actions/conversations';

import styles from './index.module.scss';
import {ReactComponent as Checkmark} from 'assets/images/icons/checkmark-circle.svg';
import {newestFilteredConversationFirst} from '../../../selectors/conversations';

type ConversationListItemProps = {
  conversation: MergedConversation;
  active: boolean;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  readConversations,
  conversationState,
};

const mapStateToProps = (state: StateModel) => {
  return {
    filteredConversations: newestFilteredConversationFirst(state),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, readConversations, conversationState} = props;

  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;
  const currentConversationState = conversation.metadata.state || 'OPEN';

  const eventHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const newState = currentConversationState === 'OPEN' ? 'CLOSED' : 'OPEN';
    conversationState(conversation.id, newState);
    event.preventDefault();
    event.stopPropagation();
  };

  const OpenStateButton = () => {
    return (
      <div className={styles.openStateButton} title="Set to closed">
        <button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)} />
      </div>
    );
  };

  const ClosedStateButton = () => {
    return (
      <div className={styles.closedStateButton} title="Set to open">
        <button onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => eventHandler(event)}>
          <Checkmark />
        </button>
      </div>
    );
  };

  const markAsRead = () => {
    if (active && unread) {
      readConversations(conversation.id);
    }
  };

  useEffect(() => {
    markAsRead();
  }, [active, conversation, currentConversationState]);

  return (
    <div className={styles.clickableListItem} onClick={markAsRead}>
      <Link to={`${INBOX_CONVERSATIONS_ROUTE}/${conversation.id}`}>
        <div
          className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
            unread ? styles.unread : ''
          }`}>
          <div className={styles.profileImage}>
            <Avatar contact={participant} />
          </div>
          <div className={styles.contactDetails}>
            <div className={styles.topRow}>
              <div className={`${styles.profileName} ${unread ? styles.unread : ''}`}>
                {participant && participant.displayName}
              </div>
              {currentConversationState === 'OPEN' ? <OpenStateButton /> : <ClosedStateButton />}
            </div>
            <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
              <SourceMessagePreview conversation={conversation} />
            </div>
            <div className={styles.bottomRow}>
              <div className={styles.source}>
                {conversation.channel && <IconChannel channel={conversation.channel} showAvatar showName />}
              </div>
              <div className={styles.contactLastMessageDate}>{formatTimeOfMessage(conversation.lastMessage)}</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default connector(ConversationListItem);

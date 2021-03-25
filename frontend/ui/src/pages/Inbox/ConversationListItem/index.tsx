import React, {CSSProperties, useEffect} from 'react';
import {Link} from 'react-router-dom';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';
import {Avatar} from 'render';

import {formatTimeOfMessage} from '../../../services/format/date';

import {Message} from 'httpclient';
import {MergedConversation} from '../../../reducers';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {readConversations} from '../../../actions/conversations';

import styles from './index.module.scss';

interface FormattedMessageProps {
  message: Message;
}

type ConversationListItemProps = {
  conversation: MergedConversation;
  active: boolean;
  style: CSSProperties;
} & ConnectedProps<typeof connector>;

const mapDispatchToProps = {
  readConversations,
};

const connector = connect(null, mapDispatchToProps);

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message?.content) {
    return <>{message.content.message?.text || message.content.text}</>;
  }
  return <div />;
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, style, readConversations} = props;

  const participant = conversation.metadata.contact;
  const unread = conversation.metadata.unreadCount > 0;

  useEffect(() => {
    if (active && unread) {
      return readConversations(conversation.id);
    }
  }, [active, conversation]);

  return (
    <div className={styles.clickableListItem} style={style} onClick={() => readConversations(conversation.id)}>
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
            </div>
            <div className={`${styles.contactLastMessage} ${unread ? styles.unread : ''}`}>
              <FormattedMessage message={conversation.lastMessage} />
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

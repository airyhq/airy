import React, {CSSProperties} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';

import IconChannel from '../../../components/IconChannel';

import {formatTimeOfMessage} from '../../../services/format/date';

import {Conversation, Message} from 'httpclient';
import {StateModel} from '../../../reducers';
import {INBOX_CONVERSATIONS_ROUTE} from '../../../routes/routes';
import {readConversations} from '../../../actions/conversations';

import styles from './index.module.scss';

interface FormattedMessageProps {
  message: Message;
}

type ConversationListItemProps = {
  conversation: Conversation;
  active: boolean;
  style: CSSProperties;
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => {
  return {
    channels: state.data.channels,
  };
};

const mapDispatchToProps = {
  readConversations,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message && message.content) {
    return <>{message.content.text}</>;
  }
  return <div />;
};

const ConversationListItem = (props: ConversationListItemProps) => {
  const {conversation, active, style, readConversations} = props;

  const participant = conversation.contact;
  const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

  const unread = conversation.unreadMessageCount > 0;

  return (
    <div className={styles.clickableListItem} style={style} onClick={() => readConversations(conversation.id)}>
      <div
        className={`${active ? styles.containerListItemActive : styles.containerListItem} ${
          unread ? styles.unread : ''
        }`}>
        <div
          className={styles.profileImage}
          style={{backgroundImage: `url(${(participant && participant.avatarUrl) || fallbackAvatar})`}}
        />
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
              <IconChannel channel={conversation.channel} avatar={true} name={true} />
            </div>
            <div className={styles.contactLastMessageDate}>{formatTimeOfMessage(conversation.lastMessage)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(ConversationListItem);

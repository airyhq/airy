import React from 'react';
import _ from 'redux';
import {Message, Conversation, SenderType} from 'httpclient';
import AvatarImage from '../../../../components/AvatarImage';

import styles from './index.module.scss';
import {formatTimeOfMessage} from '../../../../services/format/date';

type MessengerListItemProps = {
  message: Message;
  conversation: Conversation;
  showAvatar: boolean;
  showSentAt: boolean;
};

const MessengerListItem = (props: MessengerListItemProps) => {
  const {conversation, showAvatar, showSentAt, message} = props;
  const isUser = message.senderType !== SenderType.appUser;

  const messageAvatar = () => {
    return conversation && <AvatarImage contact={conversation.contact} />;
  };

  const messageText = message.content[0].text;

  return (
    <div className={styles.messageListItemContainer}>
      <div className={styles.messageListItem}>
        {!isUser ? (
          <div className={styles.messageListItemMember}>
            <div className={styles.messageListItemMemberText}>{messageText}</div>
            {showSentAt && <div className={styles.messageTime}>{formatTimeOfMessage(message)}</div>}
          </div>
        ) : (
          <div className={styles.messageListUserContainer}>
            <div className={styles.messageAvatar}>{showAvatar && messageAvatar()}</div>
            <div className={styles.messageListItemUser}>
              <div className={styles.messageListItemUserText}>{messageText}</div>
              {showSentAt && <div className={styles.messageTime}>{formatTimeOfMessage(message)}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerListItem;

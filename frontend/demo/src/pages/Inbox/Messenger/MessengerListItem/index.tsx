import React from 'react';
import _redux from 'redux';
import _, {connect, ConnectedProps} from 'react-redux';
import {Message, SenderType} from 'httpclient';
import {StateModel} from '../../../../reducers';
import Avatar from '../MessageList/Avatar';

import styles from './index.module.scss';

type MessengerListItemProps = {
  messageText: string;
  messageSenderType: string;
  messageDate: Date;
  message: Message;
} & ConnectedProps<typeof connector>;

const mapStateToProps = (state: StateModel) => {
  return {
    lastMessages: state.data.conversations.all.items,
  };
};

const connector = connect(mapStateToProps, null);

const MessengerListItem = (props: MessengerListItemProps) => {
  const {messageText, messageSenderType, message, lastMessages} = props;
  const isUser = messageSenderType !== SenderType.appUser;

  const messageAvatar = (messageId: string) => {
    Object.values(lastMessages).forEach(lastMessage => {
      return (
        <Avatar isLastMessage={messageId === lastMessage.lastMessage.id} avatarUrl={lastMessage.contact.avatarUrl} />
      );
    });
  };

  return (
    <div className={styles.messageListItemContainer}>
      <div className={styles.messageListItem}>
        {!isUser ? (
          <div className={styles.messageListItemMember}>
            {messageText}
            {messageAvatar(message.id)}
          </div>
        ) : (
          <div className={styles.messageListUserContainer}>
            {messageAvatar(message.id)}
            <div className={styles.messageListItemUser}>{messageText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(MessengerListItem);

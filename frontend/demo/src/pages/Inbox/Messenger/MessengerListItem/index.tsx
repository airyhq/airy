import React, {useState} from 'react';
import _redux from 'redux';
import _, {connect, ConnectedProps} from 'react-redux';
import {Message, MessageSenderType} from '../../../../model/Message';
import {StateModel} from '../../../../reducers';
import {dateFormat} from '../../../../services/format/date';
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
  const {messageText, messageSenderType, messageDate, message, lastMessages} = props;
  const isUser = messageSenderType !== MessageSenderType.appUser;

  const messageAvatar = (messageId: string) => {
    Object.values(lastMessages).forEach(lastMessage => {
      if (messageId === lastMessage.lastMessage.id) {
        return <Avatar isLastMessage={true} avatarUrl={lastMessage.contact.avatarUrl} />;
      } else {
        return <Avatar isLastMessage={false} />;
      }
    });
  };

  return (
    <div className={styles.messageListItemContainer}>
      <div className={styles.messageListItem}>
        {!isUser ? (
          <div className={styles.messageListItemMember}>
            {/* {messageText} */}
            {/* {messageAvatar(message.id)} */}
          </div>
        ) : (
          <div className={styles.messageListUserContainer}>
            {console.log(messageAvatar(message.id))}

            {messageAvatar(message.id)}
            <div className={styles.messageListItemUser}>{messageText}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(MessengerListItem);

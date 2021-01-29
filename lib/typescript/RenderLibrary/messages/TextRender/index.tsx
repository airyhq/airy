import React from 'react'
import {Message, Conversation, SenderType, Contact} from 'httpclient';
import styles from './index.module.scss';
import {formatTimeOfMessage} from 'services';

type TextRenderProps = {
    key: string;
    message: Message;
    conversation: Conversation;
    showAvatar: boolean;
    showSentAt: boolean;
};

type AvatarProps = {
    contact: Contact;
};

const fallbackAvatar = 'https://s3.amazonaws.com/assets.airy.co/unknown.png';

const AvatarImage = (props: AvatarProps) => {
  const {contact} = props;

  return (
    <div className={styles.avatar}>
      <img className={styles.avatarImage} src={contact.avatarUrl || fallbackAvatar} />
    </div>
  );
};

const TextRender = (props: TextRenderProps) => {
  const {conversation, showAvatar, showSentAt, message} = props;
  const isUser = message.senderType !== SenderType.appUser;

  const messageAvatar = () => {
    return conversation && <AvatarImage contact={conversation.contact} />;
  };

  const messageJSON = JSON.parse(`${message.content}`)
  const messageText = messageJSON && messageJSON.text

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

export default TextRender;
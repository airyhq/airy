import React from 'react';
import {Message, MessageType, Conversation, SenderType, Contact} from 'httpclient';
import styles from './index.module.scss';
import linkifyString from 'linkifyjs/string';
import { MessagePayload } from '../httpclient/payload/MessagePayload';
import {isToday, isThisWeek, formatTimeOfMessage} from 'services';

type RenderLibraryProps = {
  message: Message;
  isChatPlugin: boolean;
  currentConversation?: Conversation;
  prevWasContact?: boolean;
  isContact?: (message: Message) => boolean;
  nextIsSameUser?: boolean;
};

type TextRenderProps = {
  message: Message;
  conversation: Conversation;
  showAvatar: boolean;
  showSentAt: boolean;
};

type AvatarProps = {
  contact: Contact;
};

// type ChatPluginTextRenderProps = {
//     message: {
//       id: string;
//       sender_type: string;
//       content: {
//         text: string;
//         type: string;
//       }[];
//       delivery_state: string;
//       sent_at: string;
//       state: string;
//     };
// };

type ChatPluginTextRenderProps = {
    message: Message;
};

// Chat Plugin Render

const ChatPluginTextRender = (props: ChatPluginTextRenderProps) => {
  const {message} = props;
  const isInbound = message.senderType === 'source_contact';
  const messageDisplay = linkifyString(message.content[0].text, {
    className: `${isInbound ? styles.messageLinkRight : styles.messageLinkLeft}`,
  });

  return (
    <div className={`${isInbound ? styles.containerRight : styles.containerLeft}`}>
      <div className={`${isInbound ? styles.bubbleRight : styles.bubbleLeft}`}>
        <div dangerouslySetInnerHTML={{__html: messageDisplay}} />
      </div>
    </div>
  );
};

// UI render

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

const RenderLibrary = (props: RenderLibraryProps) => {
  const {message, currentConversation, prevWasContact, isContact, nextIsSameUser, isChatPlugin} = props;

  switch (message.content[0].type) {
    case MessageType.audio:
      console.log('AUDIO');
      break;
    case MessageType.file:
      console.log('FILE');
      break;
    case MessageType.image:
      console.log('IMAGE');
      break;
    case MessageType.text:
      if (isChatPlugin) {
        return <ChatPluginTextRender message={message} />;
      } else {
        return (
          <TextRender
            key={message.id}
            conversation={currentConversation}
            message={message}
            showAvatar={!prevWasContact && isContact(message)}
            showSentAt={!nextIsSameUser}
          />
        );
      }
    case MessageType.video:
      console.log('VIDEO');
      break;
    default:
      return null;
  }
};

export default RenderLibrary;

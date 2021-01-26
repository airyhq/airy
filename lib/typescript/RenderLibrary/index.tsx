import React from 'react';
import {Message, MessageType, Conversation, SenderType, Contact} from 'httpclient';
import styles from './index.module.scss';
import linkifyString from 'linkifyjs/string';
import {formatTimeOfMessage} from 'services';
import TextRender from './messages/TextRender/index';

type RenderLibraryProps = {
  message: Message;
  currentConversation?: Conversation;
  prevWasContact?: boolean;
  isContact: boolean;
  nextIsSameUser?: boolean;
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

const RenderLibrary = (props: RenderLibraryProps) => {
  const {message, currentConversation, prevWasContact, isContact, nextIsSameUser} = props;

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
      return (
        <TextRender
          key={message.id}
          conversation={currentConversation}
          message={message}
          showAvatar={!prevWasContact && isContact}
          showSentAt={!nextIsSameUser}
        />
      );
    case MessageType.video:
      console.log('VIDEO');
      break;
    default:
      return null;
  }
};

export default RenderLibrary;

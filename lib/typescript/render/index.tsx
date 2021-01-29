import React from 'react';
import {Message, MessageSource, Conversation} from 'httpclient';
import TextRender from './messages/TextRender/index';

type RenderLibraryProps = {
  message: Message;
  source: string;
  currentConversation?: Conversation;
  prevWasContact?: boolean;
  isContact: boolean;
  nextIsSameUser?: boolean;
};

const RenderLibrary = (props: RenderLibraryProps) => {
  const {message, currentConversation, prevWasContact, isContact, nextIsSameUser, source} = props;

  switch (source) {
    case MessageSource.facebook ||
      MessageSource.google ||
      MessageSource.chatplugin ||
      MessageSource.whatsappTwilio ||
      MessageSource.smsTwilio:
      return (
        <TextRender
          conversation={currentConversation}
          message={message}
          showAvatar={!prevWasContact && isContact}
          showSentAt={!nextIsSameUser}
        />
      );
    default:
      return (
        <TextRender
          conversation={currentConversation}
          message={message}
          showAvatar={!prevWasContact && isContact}
          showSentAt={!nextIsSameUser}
        />
      );
  }
};

export default RenderLibrary;

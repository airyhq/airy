import React from 'react';
import {Message, Conversation} from 'httpclient';
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
  const {message, currentConversation, prevWasContact, isContact, nextIsSameUser} = props;
  return (
    <TextRender
      conversation={currentConversation}
      message={message}
      showAvatar={!prevWasContact && isContact}
      showSentAt={!nextIsSameUser}
    />
  );
};

export default RenderLibrary;

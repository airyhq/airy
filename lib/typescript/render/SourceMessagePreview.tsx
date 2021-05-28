import React from 'react';
import {ReactComponent as AttachmentTemplate} from 'assets/images/icons/attachmentTemplate.svg';
import {ReactComponent as AttachmentImage} from 'assets/images/icons/attachmentImage.svg';
import {ReactComponent as AttachmentVideo} from 'assets/images/icons/attachmentVideo.svg';
import {ReactComponent as RichCardIcon} from 'assets/images/icons/richCardIcon.svg';
import {Message} from 'model';
import {MergedConversation} from 'frontend/ui/src/reducers';

interface SourceMessagePreviewProps {
  conversation: MergedConversation;
}

interface FormattedMessageProps {
  message: Message;
}

const FormattedMessage = ({message}: FormattedMessageProps) => {
  if (message?.content) {
    return <>{message.content.message?.text || message.content.text}</>;
  }
  return <div />;
};

export const SourceMessagePreview = (props: SourceMessagePreviewProps) => {
  const {conversation} = props;

  const lastMessageIsText = (conversation: MergedConversation) => {
    const lastMessageContent = conversation.lastMessage.content;

    if (typeof lastMessageContent === 'string') {
      if (lastMessageContent.includes('&Body=' && '&FromCountry=')) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&FromCountry=');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(startText + 6, startText + textLength);
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return text;
      } else if (lastMessageContent.includes('&Body=' && '&To=whatsapp')) {
        const startText = lastMessageContent.search('&Body=');
        const endText = lastMessageContent.search('&To=whatsapp');
        const textLength = endText - startText;
        const enCodedText = lastMessageContent.substring(startText + 6, startText + textLength);
        const replaced = enCodedText.split('+').join(' ');
        const text = decodeURIComponent(replaced);
        return text;
      }
    }
    if (lastMessageContent.text || lastMessageContent.message?.text) {
      return <FormattedMessage message={conversation.lastMessage} />;
    } else if (lastMessageContent.suggestionResponse) {
      return <>{conversation.lastMessage.content.suggestionResponse.text}</>;
    }
  };

  const lastMessageIsIcon = (conversation: MergedConversation) => {
    const lastMessageContent = conversation.lastMessage.content;

    if (!lastMessageContent.attachment) {
      if (lastMessageContent.message?.attachments?.[0].type === 'image') {
        return <AttachmentImage />;
      } else if (lastMessageContent.message?.attachments?.[0].type === 'video') {
        return <AttachmentVideo style={{height: '24px', width: '24px', margin: '0px'}} />;
      } else if (lastMessageContent.suggestionResponse) {
        return <>{conversation.lastMessage.content.suggestionResponse.text}</>;
      } else if (lastMessageContent.image) {
        return <AttachmentImage />;
      } else if (lastMessageContent.richCard) {
        return <RichCardIcon style={{height: '24px', width: '24px', margin: '0px'}} />;
      }
    }
    return <AttachmentTemplate />;
  };

  return <>{lastMessageIsText(conversation) || lastMessageIsIcon(conversation)}</>;
};

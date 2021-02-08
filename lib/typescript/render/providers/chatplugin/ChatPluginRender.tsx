import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichText} from '../../components/RichText';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';
import {Message, isFromContact} from 'httpclient';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const {message} = props;
  const content = isFromContact(message) ? chatpluginInbound(message) : chatpluginOutbound(message);

  return render(content, props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  const messageContent = JSON.parse(props.message.content);
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;
    case 'richText':
      return (
        <RichText
          {...getDefaultMessageRenderingProps(props)}
          message={props.message}
          text={messageContent.text}
          fallback={messageContent.fallback}
          containsRichText={messageContent.containsRichText}
        />
      );

    // TODO render more chatplugin models
  }
}

// TODO map more string content to chatplugin models
function chatpluginInbound(message: Message): ContentUnion {
  const messageContent = JSON.parse(message.content);
  if (messageContent && messageContent.containsRichText) {
    return {
      type: 'richText',
      text: messageContent.text,
      fallback: messageContent.fallback,
      containsRichtText: messageContent.containsRichText,
    };
  } else {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }
}

function chatpluginOutbound(message: Message): ContentUnion {
  const messageContent = JSON.parse(message.content);
  if (messageContent && messageContent.containsRichText) {
    return {
      type: 'richText',
      text: messageContent.text,
      fallback: messageContent.fallback,
      containsRichtText: messageContent.containsRichText,
    };
  } else {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }
}

import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Suggestions} from './components/Suggestions';
import {Text} from '../../components/Text';
import {ContentUnion} from './googleModel';
import {Message, isFromContact} from 'httpclient';
import {Image} from '../../components/Image';

export const GoogleRender = (props: MessageRenderProps) => {
  const message = props.message;
  const content = isFromContact(message) ? googleInbound(message) : googleOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  console.log('content', content);
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;

    case 'image':
      return <Image {...getDefaultMessageRenderingProps(props)} imageUrl={content.imageUrl} />;

    case 'suggestions':
      return (
        <Suggestions
          {...getDefaultMessageRenderingProps(props)}
          text={content.text}
          fallback={content.fallback}
          suggestions={content.suggestions}
        />
      );
  }
}

function googleInbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);

  console.log('inbound - messageJson', messageJson);

  if (messageJson.suggestionResponse) {
    return {
      type: 'text',
      text: messageJson.suggestionResponse.text,
    };
  }

  if (
    messageJson.message.text &&
    messageJson.message.text.includes('https://storage.googleapis.com') &&
    (messageJson.message.text.includes('X-Goog-Algorithm') || messageJson.message.text.includes('x-goog-algorithm')) &&
    (messageJson.message.text.includes('X-Goog-Credential') || messageJson.message.text.includes('x-goog-credential'))
  ) {
    return {
      type: 'image',
      imageUrl: messageJson.message.text,
    };
  }

  if (messageJson.message.text) {
    return {
      type: 'text',
      text: messageJson.message.text,
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function googleOutbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);

  console.log('outbound - messageJson', messageJson);

  if (messageJson.text && messageJson.suggestions) {
    return {
      type: 'suggestions',
      text: messageJson.text,
      suggestions: messageJson.suggestions,
    };
  }

  if (messageJson.image && messageJson.suggestions) {
    return {
      type: 'suggestions',
      image: {fileUrl: messageJson.image.contentInfo.fileUrl, altText: messageJson.image.contentInfo.altText},
      suggestions: messageJson.suggestions,
    };
  }

  if (messageJson.image) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  if (messageJson.fallback) {
    return {
      type: 'text',
      text: messageJson.fallback,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}

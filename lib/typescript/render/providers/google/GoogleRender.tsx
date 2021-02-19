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
          image={content.image}
          fallback={content.fallback}
          suggestions={content.suggestions}
        />
      );
  }
}

function googleInbound(message: Message): ContentUnion {
  const messageJson = message.content.message;

  if (messageJson.suggestionResponse) {
    return {
      type: 'text',
      text: messageJson.suggestionResponse.text,
    };
  }

  if (messageJson.authenticationResponse) {
    if (messageJson.authenticationResponse.code && !messageJson.authenticationResponse.errorDetails) {
      return {
        type: 'text',
        text: 'Authentication was successful',
      };
    }

    if (messageJson.authenticationResponse.errorDetails && !messageJson.authenticationResponse.code) {
      return {
        type: 'text',
        text: messageJson.authenticationResponse.errorDetails.errorDescription ?? 'Authentication failed',
      };
    }
  }

  if (
    messageJson.text &&
    messageJson.text.includes('https://storage.googleapis.com') &&
    messageJson.text.toLowerCase().includes('x-goog-algorithm') &&
    messageJson.text.toLowerCase().includes('x-goog-credential')
  ) {
    return {
      type: 'image',
      imageUrl: messageJson.text,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function googleOutbound(message: Message): ContentUnion {
  const messageJson = message.content;

  if (messageJson.suggestions) {
    if (messageJson.suggestions.length > 13) {
      messageJson.suggestions = messageJson.suggestions.slice(0, 13);
    }

    if (messageJson.text) {
      return {
        type: 'suggestions',
        text: messageJson.text,
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.image) {
      return {
        type: 'suggestions',
        image: {fileUrl: messageJson.image.contentInfo.fileUrl, altText: messageJson.image.contentInfo.altText},
        suggestions: messageJson.suggestions,
      };
    }
  }

  if (messageJson.image) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson.image.contentInfo.altText,
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

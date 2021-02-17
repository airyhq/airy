import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Suggestions} from './components/Suggestions';
import {Text} from '../../components/Text';
import {ContentUnion} from './googleModel';
import {Message, isFromContact} from 'httpclient';
import {Image} from '../../components/Image';
import {RichText} from '../../components/RichText';

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

    case 'richText':
      return (
        <RichText
          {...getDefaultMessageRenderingProps(props)}
          message={props.message}
          text={content.text}
          fallback={content.fallback}
          containsRichText={content.containsRichtText}
        />
      );

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

//GoogleInbound
//messages received from via Goggle B Messages chat
//message object
//image are links in text field
//- text
//- image
//- suggestionResponse
function googleInbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);

  console.log('inbound - messageJson', messageJson);

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

    if (!messageJson.authenticationResponse.code && messageJson.authenticationResponse.errorDetails) {
      return {
        type: 'text',
        text: messageJson.authenticationResponse.errorDetails.errorDescription ?? 'Authentication failed',
      };
    }
  }

  if (
    messageJson.message.text &&
    messageJson.message.text.includes('https://storage.googleapis.com') &&
    messageJson.message.text.toLowerCase().includes('x-goog-algorithm') &&
    messageJson.message.text.toLowerCase().includes('x-goog-credential')
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

//Google Outbound
//messages sent via Curl / or the UI
function googleOutbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);

  console.log('outbound - messageJson', messageJson);

  if (messageJson.containsRichText) {
    return {
      type: 'richText',
      text: messageJson.text,
      fallback: messageJson.fallback,
      containsRichtText: messageJson.containsRichText,
    };
  }

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

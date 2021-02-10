import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichText} from '../../components/RichText';
import {RichCard} from '../../components/RichCard';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';
import {Message} from 'httpclient';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const {message} = props;

  return render(mapContent(message), props);
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
    case 'richCard':
      return (
        <RichCard
          {...getDefaultMessageRenderingProps(props)}
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );
  }
}

function mapContent(message: Message): ContentUnion {
  const messageContent = JSON.parse(message.content);
  if (messageContent.containsRichText) {
    return {
      type: 'richText',
      text: messageContent.text,
      fallback: messageContent.fallback,
      containsRichtText: messageContent.containsRichText,
    };
  }
  if (messageContent.richCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageContent;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  } else {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }
}

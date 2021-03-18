import React from 'react';
import {getDefaultRenderingProps, MessageRenderProps} from '../../shared';
import {RichText} from '../../components/RichText';
import {RichCard} from '../../components/RichCard';
import {RichCardCarousel} from '../../components/RichCardCarousel';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';
import {RenderedContentUnion} from 'httpclient';

export const ChatPluginRender = (props: MessageRenderProps) => {
  return render(mapContent(props.renderedContent), props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  const defaultProps = {...getDefaultRenderingProps(props), commandCallback: props.commandCallback};
  const invertedProps = {...defaultProps, fromContact: !defaultProps.fromContact};
  const propsToUse = props.invertSides ? invertedProps : defaultProps;

  switch (content.type) {
    case 'text':
      return <Text {...propsToUse} text={content.text} />;
    case 'suggestionResponse':
      return <Text {...propsToUse} text={content.text} />;
    case 'richText':
      return (
        <RichText
          {...propsToUse}
          message={props.renderedContent}
          text={content.text}
          fallback={content.fallback}
          containsRichText={content.containsRichtText}
        />
      );
    case 'richCard':
      return (
        <RichCard
          {...propsToUse}
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );
    case 'richCardCarousel':
      return <RichCardCarousel {...propsToUse} cardWidth={content.cardWidth} cardContents={content.cardContents} />;
  }
}

function mapContent(message: RenderedContentUnion): ContentUnion {
  const messageContent = message.content.message ?? message.content;

  if (messageContent.richCard?.standaloneCard) {
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
  }

  if (messageContent.richCard?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageContent.richCard.carouselCard.cardWidth,
      cardContents: messageContent.richCard.carouselCard.cardContents,
    };
  }

  if (messageContent.postbackData) {
    return {
      type: 'suggestionResponse',
      text: messageContent.text,
      postbackData: messageContent.postbackData,
    };
  }

  if (messageContent.containsRichText) {
    return {
      type: 'richText',
      text: messageContent.text,
      fallback: messageContent.fallback,
      containsRichtText: parseBoolean(messageContent.containsRichText),
    };
  }

  if (messageContent.text) {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}

const parseBoolean = value => (typeof value == 'boolean' ? value : /^true$/i.test(value));

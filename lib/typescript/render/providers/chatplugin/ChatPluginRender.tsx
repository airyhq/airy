import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichText} from '../../components/RichText';
import {RichCard} from '../../components/RichCard';
import {RichCardCarousel} from '../../components/RichCardCarousel';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';
import {Message} from 'httpclient';

export const ChatPluginRender = (props: MessageRenderProps) => {
  return render(mapContent(props.message), props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  const messageContent = JSON.parse(props.message.content);

  const defaultProps = getDefaultMessageRenderingProps(props);
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
          message={props.message}
          text={messageContent.text}
          fallback={messageContent.fallback}
          containsRichText={messageContent.containsRichText}
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
      return (
        <RichCardCarousel
          {...propsToUse}
          cardWidth={content.cardWidth}
          cardContents={content.cardContents}
          id={props.message.id}
          isChatPlugin={propsToUse.fromContact}
        />
      );
  }
}

function mapContent(message: Message): ContentUnion {
  const messageContent = JSON.parse(message.content);

  if (messageContent.text) {
    return {
      type: 'text',
      text: JSON.parse(message.content).text,
    };
  }

  if (messageContent.richCard.standaloneCard) {
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

  if (messageContent.richCard.carouselCard) {
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
}

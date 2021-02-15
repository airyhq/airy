import React from 'react';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichText} from '../../components/RichText';
import {RichCard} from '../../components/RichCard';
import {RichCardCarousel} from '../../components/RichCardCarousel';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';
import {Message} from 'httpclient';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const {message} = props;

  return render(mapContent(message), props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  const messageContent = JSON.parse(props.message.content);

  const defaultProps = getDefaultMessageRenderingProps(props);
  const invertedProps = {...defaultProps, fromContact: !defaultProps.fromContact};
  const propsToUse = props.invertSides ? invertedProps : defaultProps;

  switch (content.type) {
    case 'text':
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
          {...getDefaultMessageRenderingProps(props)}
          cardWidth={content.cardWidth}
          cardContents={content.cardContents}
          id={props.message.id}
        />
      )
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

  if (messageContent.richCard.carouselCard) {
    const {
      richCard: {
        carouselCard: {
          cardWidth,
          cardContents: [{
          }]
        },
      },
    } = messageContent;

    console.log(messageContent.cardContents);

    return {
      type: 'richCardCarousel',
      cardWidth: cardWidth,
      ...(cardContents.title && {title: cardContents.title}),
      ...(cardContents.description && {description: cardContents.description}),
      media: cardContents.media,
      suggestions: cardContents.suggestions,
    };
  }
}

import React from 'react';
import {Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichCard} from '../../components/RichCard';
import {RichCardCarousel} from '../../components/RichCardCarousel';
import {ContentUnion} from './chatPluginModel';
import {Text} from '../../components/Text';

export const ChatPluginRender = (props: MessageRenderProps) => {
  return render(mapContent(props.message), props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;
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
    case 'richCardCarousel':
      return (
        <RichCardCarousel 
        {...getDefaultMessageRenderingProps(props)}
        cards={content.}
        title={content.title}
        description={content.description}
        media={content.media}
        suggestions={content.suggestions}
        cardWidth={content.cardWidth}
        />
      )
  }
}

function mapContent(message: Message): ContentUnion {
  const messageContent = JSON.parse(message.content);

  console.log(messageContent);

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

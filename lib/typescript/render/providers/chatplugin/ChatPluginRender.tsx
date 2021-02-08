import React from 'react';
import {Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichCard} from '../../components/RichCard';
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

  if (messageContent.richCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageContent;

    return {
      type: 'richCard',
      title: cardContent.title,
      description: cardContent.description,
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }
}

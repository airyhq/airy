import React from 'react';
import {Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {RichCardComponent} from '../../components/RichCard';
import {RichCardContent, ContentUnion, TextContent} from './chatPluginModel';
import {Text} from '../../components/Text';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const {
    message: {content},
    message,
  } = props;

  if (JSON.parse(content).text) {
    return render(mapTextContent(message), props);
  }

  if (JSON.parse(content).richCard) {
    return render(mapRichCardContent(message), props);
  }
};

function render(content: ContentUnion, props: MessageRenderProps) {
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;
    case 'richCard':
      return (
        <RichCardComponent
          {...getDefaultMessageRenderingProps(props)}
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );
  }
}

function mapTextContent(message: Message): TextContent {
  return {
    type: 'text',
    text: JSON.parse(message.content).text,
  };
}

function mapRichCardContent(message: Message): RichCardContent {
  const {
    richCard: {
      standaloneCard: {cardContent},
    },
  } = JSON.parse(message.content);

  return {
    type: 'richCard',
    title: cardContent.title,
    description: cardContent.description,
    media: cardContent.media,
    suggestions: cardContent.suggestions,
  };
}

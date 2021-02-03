import React from 'react';
import {isFromContact, Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Text} from '../../components/Text';
import {ContentUnion} from './chatPluginModel';

export const ChatPluginRender = (props: MessageRenderProps) => {
  const message = props.message;
  return render(mapContent(message), props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;
  }
}

function mapContent(message: Message): ContentUnion {
  return {
    type: 'text',
    text: JSON.parse(message.content).text,
  };
}

import React from 'react';
import {isFromContact, RenderedContent} from '../../../../httpclient/model';
import {Text} from '../../../components/Text';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../../shared';
import {ContentUnion} from './twilioWhatsappModel';

export const TwilioWhatsappRender = (props: MessageRenderProps) => {
  const {message} = props;
  const content = isFromContact(message) ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;
  }
}

const inboundContent = (message: RenderedContent): ContentUnion => {
  const messageContent = message.content;
  const startText = messageContent.search('&Body=');
  const endText = messageContent.search('&To=whatsapp');
  const textLength = endText - startText;
  const enCodedText = messageContent.substring(startText + 6, startText + textLength);
  const replaced = enCodedText.split('+').join(' ');
  const text = decodeURIComponent(replaced);

  return {
    type: 'text',
    text: text,
  };
};

const outboundContent = (message: RenderedContent): ContentUnion => {
  const messageContent = message.content.message ?? message.content;
  return {
    type: 'text',
    text: messageContent.text,
  };
};

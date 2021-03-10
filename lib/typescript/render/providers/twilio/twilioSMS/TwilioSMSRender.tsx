import React from 'react';
import {isFromContact, Message} from '../../../../httpclient/model';
import {Text} from '../../../components/Text';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../../shared';
import {ContentUnion} from './twilioSMSModel';

export const TwilioSMSRender = (props: MessageRenderProps) => {
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

const inboundContent = (message: Message): ContentUnion => {
  const messageContent = message.content;
  const startText = messageContent.search('&Body=');
  const endText = messageContent.search('&FromCountry=');
  const textLength = endText - startText;
  const enCodedText = messageContent.substring(startText + 6, startText + textLength);
  const replaced = enCodedText.split('+').join(' ');
  const text = decodeURIComponent(replaced);

  return {
    type: 'text',
    text: text,
  };
};

const outboundContent = (message: Message): ContentUnion => {
  const messageContent = message.content;
  return {
    type: 'text',
    text: messageContent.text,
  };
};

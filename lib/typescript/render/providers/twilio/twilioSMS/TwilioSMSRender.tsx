import React from 'react';
import {Message} from 'model';
import {Text} from '../../../components/Text';
import {RenderPropsUnion} from '../../../props';
import {ContentUnion} from './twilioSMSModel';

export const TwilioSMSRender = (props: RenderPropsUnion) => {
  const message: Message = props.content;
  const content = message.fromContact ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.content.fromContact || false} text={content.text} />;
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
  const messageContent = message.content.message ?? message.content;
  return {
    type: 'text',
    text: messageContent.text,
  };
};

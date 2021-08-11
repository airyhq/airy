import React from 'react';
import {Text} from '../../components/Text';
import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './twilioModel';

export const TwilioRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? inboundContent(message) : outboundContent(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;
  }
}

const inboundContent = (message): ContentUnion => {
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

const outboundContent = (message): ContentUnion => {
  const messageContent = message.content.message ?? message.content;
  return {
    type: 'text',
    text: messageContent.Body,
  };
};

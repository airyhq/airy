import React from 'react';
import {isFromContact, Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {Attachment, ContentUnion} from './facebookModel';

export const FacebookRender = (props: MessageRenderProps) => {
  const message = props.message;
  const content = isFromContact(message) ? facebookInbound(message) : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: MessageRenderProps) {
  switch (content.type) {
    case 'text':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.text} />;

    case 'image':
      return <Image {...getDefaultMessageRenderingProps(props)} imageUrl={content.imageUrl} />;
  }
}

const parseAttachment = (attachement: Attachment): ContentUnion => {
  if (attachement.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachement.payload.url,
    };
  }
  return {
    type: 'text',
    text: attachement.payload.title || 'Unknown message type',
  };
};

function facebookInbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);

  if (messageJson.message.attachments?.length) {
    return parseAttachment(messageJson.message.attachments[0]);
  } else if (messageJson.message.text) {
    return {
      type: 'text',
      text: messageJson.message.text,
    };
  } else {
    return {
      type: 'text',
      text: 'Unkown message type',
    };
  }
}

function facebookOutbound(message: Message): ContentUnion {
  const messageJson = JSON.parse(message.content);
  return {
    type: 'text',
    text: messageJson.text,
  };
}

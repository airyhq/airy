import React from 'react';
import {isFromContact, Message} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {SimpleAttachment, ButtonAttachment, ContentUnion, GenericAttachment} from './facebookModel';
import {ButtonTemplate} from './components/ButtonTemplate';
import {GenericTemplate} from './components/GenericTemplate';

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

    case 'buttonTemplate':
      return <ButtonTemplate {...getDefaultMessageRenderingProps(props)} template={content} />;

    case 'genericTemplate':
      return <GenericTemplate {...getDefaultMessageRenderingProps(props)} template={content} />;
  }
}

const parseAttachment = (attachement: SimpleAttachment | ButtonAttachment | GenericAttachment): ContentUnion => {
  if (attachement.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachement.payload.url,
    };
  } else if (attachement.type === 'template' && attachement.payload.template_type == 'button') {
    return {
      type: 'buttonTemplate',
      text: attachement.payload.text,
      buttons: attachement.payload.buttons,
    };
  } else if (attachement.type === 'template' && attachement.payload.template_type == 'generic') {
    return {
      type: 'genericTemplate',
      elements: attachement.payload.elements,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
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
  if (messageJson.attachment) {
    return parseAttachment(messageJson.attachment);
  } else if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  } else {
    return {
      type: 'text',
      text: 'Unknown message type',
    };
  }
}

import React from 'react';
import {isFromContact, RenderedContent} from '../../../httpclient/model';
import {getDefaultMessageRenderingProps, MessageRenderProps} from '../../shared';
import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {Video} from '../../components/Video';
import {QuickReplies} from './components/QuickReplies';
import {AttachmentUnion, SimpleAttachment, ContentUnion, ButtonAttachment, GenericAttachment} from './facebookModel';
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

    case 'postback':
      return <Text {...getDefaultMessageRenderingProps(props)} text={content.title} />;

    case 'image':
      return <Image {...getDefaultMessageRenderingProps(props)} imageUrl={content.imageUrl} />;

    case 'video':
      return <Video {...getDefaultMessageRenderingProps(props)} videoUrl={content.videoUrl} />;

    case 'buttonTemplate':
      return <ButtonTemplate {...getDefaultMessageRenderingProps(props)} template={content} />;

    case 'genericTemplate':
      return <GenericTemplate {...getDefaultMessageRenderingProps(props)} template={content} />;

    case 'quickReplies':
      return (
        <QuickReplies
          {...getDefaultMessageRenderingProps(props)}
          text={content.text}
          attachment={content.attachment}
          quickReplies={content.quickReplies}
        />
      );
  }
}

const parseAttachment = (attachement: SimpleAttachment | ButtonAttachment | GenericAttachment): AttachmentUnion => {
  if (attachement.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachement.payload.url,
    };
  }

  if (attachement.type === 'template' && attachement.payload.template_type == 'button') {
    return {
      type: 'buttonTemplate',
      text: attachement.payload.text,
      buttons: attachement.payload.buttons,
    };
  }

  if (attachement.type === 'template' && attachement.payload.template_type == 'generic') {
    return {
      type: 'genericTemplate',
      elements: attachement.payload.elements,
    };
  }

  if (attachement.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachement.payload.url,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};

function facebookInbound(message: RenderedContent): ContentUnion {
  const messageJson = message.content;

  if (messageJson.message?.attachments?.length) {
    return parseAttachment(messageJson.message.attachments[0]);
  } else if (messageJson.message?.text) {
    return {
      type: 'text',
      text: messageJson.message?.text,
    };
  }

  if (messageJson.postback?.title) {
    return {
      type: 'postback',
      title: messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  if (messageJson.message?.text) {
    return {
      type: 'text',
      text: messageJson.message.text,
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function facebookOutbound(message: RenderedContent): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.quick_replies) {
    if (messageJson.quick_replies.length > 13) {
      messageJson.quick_replies = messageJson.quick_replies.slice(0, 13);
    }

    if (messageJson.attachment || messageJson.attachments) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(messageJson.attachment || messageJson.attachments),
        quickReplies: messageJson.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageJson.text,
      quickReplies: messageJson.quick_replies,
    };
  }

  if (messageJson.attachment || messageJson.attachments) {
    return parseAttachment(messageJson.attachment || messageJson.attachments[0]);
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}

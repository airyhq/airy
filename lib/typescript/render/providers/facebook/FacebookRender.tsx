import React from 'react';
import {Message} from 'model';
import {RenderPropsUnion} from '../../props';
import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {Video} from '../../components/Video';
import {QuickReplies} from './components/QuickReplies';
import {
  AttachmentUnion,
  SimpleAttachment,
  ContentUnion,
  ButtonAttachment,
  GenericAttachment,
  MediaAttachment,
} from './facebookModel';
import {ButtonTemplate} from './components/ButtonTemplate';
import {GenericTemplate} from './components/GenericTemplate';
import {MediaTemplate} from './components/MediaTemplate';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message: Message = props.content;
  const content = message.fromContact ? facebookInbound(message) : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.content.fromContact || false} text={content.text} />;

    case 'fallback':
      return (
        <>
          {content.text && <Text fromContact={props.content.fromContact || false} text={content.text} />}

          {content.title && <Text fromContact={props.content.fromContact || false} text={content.title} />}

          {content.url && <Text fromContact={props.content.fromContact || false} text={content.url} />}
        </>
      );

    case 'postback':
      return <Text fromContact={props.content.fromContact || false} text={content.title} />;

    case 'image':
      return (
        <>
          <Image imageUrl={content.imageUrl} />
        </>
      );

    case 'video':
      return (
        <>
          <Video videoUrl={content.videoUrl} />
        </>
      );

    case 'buttonTemplate':
      return <ButtonTemplate template={content} />;

    case 'genericTemplate':
      return (
        <>
          <GenericTemplate template={content} />
        </>
      );

    case 'mediaTemplate':
      return (
        <>
          <MediaTemplate template={content} />
        </>
      );

    case 'quickReplies':
      return (
        <QuickReplies
          fromContact={props.content.fromContact || false}
          text={content.text}
          attachment={content.attachment}
          quickReplies={content.quickReplies}
        />
      );

    default:
      return null;
  }
}

const parseAttachment = (
  attachment: SimpleAttachment | ButtonAttachment | GenericAttachment | MediaAttachment
): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type === 'button') {
    return {
      type: 'buttonTemplate',
      text: attachment.payload.text,
      buttons: attachment.payload.buttons,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type === 'generic') {
    return {
      type: 'genericTemplate',
      elements: attachment.payload.elements,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type === 'media') {
    return {
      type: 'mediaTemplate',
      media_type: attachment.payload.elements[0].media_type,
      url: attachment.payload.elements[0].url ?? null,
      attachment_id: attachment.payload.elements[0].attachment_id ?? null,
      buttons: attachment.payload.elements[0].buttons,
    };
  }

  if (attachment.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'fallback') {
    return {
      type: 'fallback',
      title: attachment.payload?.title ?? attachment.title,
      url: attachment.payload?.url ?? attachment.url,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};

function facebookInbound(message: Message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.attachments?.length && messageJson.attachments?.type === 'fallback') {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.attachments?.length) {
    return parseAttachment(messageJson.attachments[0]);
  }

  if (messageJson.postback?.title) {
    return {
      type: 'postback',
      title: messageJson.postback.title,
      payload: messageJson.postback.payload,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function facebookOutbound(message: Message): ContentUnion {
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

  if (messageJson.attachment?.type === 'fallback' || messageJson.attachments?.[0].type === 'fallback') {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
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

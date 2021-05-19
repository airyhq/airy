import React from 'react';
import {Message} from 'model';
import {RenderPropsUnion} from '../../props';
import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {Video} from '../../components/Video';
import {QuickReplies} from './components/QuickReplies';
import {AttachmentUnion, SimpleAttachment, ContentUnion, ButtonAttachment, GenericAttachment,  MediaAttachment, FallbackAttachment } from './facebookModel';
import {ButtonTemplate} from './components/ButtonTemplate';
import {GenericTemplate} from './components/GenericTemplate';
import {MediaTemplate} from './components/MediaTemplate';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message: Message = props.content;
  console.log('message', message)
  const content = message.fromContact ? facebookInbound(message) : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  console.log('render', content)
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
          {content.text && <Text fromContact={props.content.fromContact || false} text={content.text} />}

          <Image imageUrl={content.imageUrl} />
        </>
      );

    case 'video':
      return (
        <>
          {content.text && <Text fromContact={props.content.fromContact || false} text={content.text} />}

          <Video videoUrl={content.videoUrl} />
        </>
      );

    case 'buttonTemplate':
      return <ButtonTemplate template={content} />;

    case 'genericTemplate':
      return (
        <>
          {content.text && <Text fromContact={props.content.fromContact || false} text={content.text} />}

          <GenericTemplate template={content} />
        </>
      );

    case 'mediaTemplate':
      return (
        <>
          {content.text && <Text fromContact={props.content.fromContact || false} text={content.text} />}

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
  attachment: SimpleAttachment | FallbackAttachment | ButtonAttachment | GenericAttachment | MediaAttachment
): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type == 'button') {
    return {
      type: 'buttonTemplate',
      text: attachment.payload.text,
      buttons: attachment.payload.buttons,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type == 'generic') {
    return {
      type: 'genericTemplate',
      elements: attachment.payload.elements,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type == 'media') {
    return {
      type: 'mediaTemplate',
      elements: attachment.payload.elements,
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
      url: attachment.payload?.url ?? attachment.url
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};

function facebookInbound(message: Message): ContentUnion {
  const messageJson = message.content;
  console.log('INBOUND', messageJson);

  if (messageJson.attachment || messageJson.attachments) {
    if ('text' in messageJson) {
      return {
        ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
        text: messageJson.text,
      };
    }

    return parseAttachment(messageJson.attachment || messageJson.attachments[0]);
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

function facebookOutbound(message: Message): ContentUnion {
  const messageJson = message.content.message ?? message.content;
  console.log('OUTOUND', messageJson);

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
    if ('text' in messageJson) {
      return {
        ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
        text: messageJson.text,
      };
    }

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

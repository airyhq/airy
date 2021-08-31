import React from 'react';
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
import {FallbackAttachment} from './components/FallbackAttachment';
import {StoryMention} from './components/StoryMention';

export const FacebookRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? facebookInbound(message) : facebookOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  console.log('content', content)
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

    case 'fallback':
      return <FallbackAttachment fromContact={props.message.fromContact || false} content={content} />;

    case 'postback':
      return <Text fromContact={props.message.fromContact || false} text={content.title ?? content.payload} />;

    case 'image':
      return <Image imageUrl={content.imageUrl} />;

    case 'images':
      return <Image images={content.images} />;

    case 'video':
      return <Video videoUrl={content.videoUrl} />;

    case 'buttonTemplate':
      return <ButtonTemplate template={content} />;

    case 'genericTemplate':
      return <GenericTemplate template={content} />;

    case 'mediaTemplate':
      return <MediaTemplate template={content} />;

    case 'quickReplies':
      return (
        <QuickReplies
          fromContact={props.message.fromContact || false}
          text={content.text}
          attachment={content.attachment}
          quickReplies={content.quickReplies}
        />
      );

    case 'story_mention':
      return(
        <StoryMention  url={content.url} sentAt={content.sentAt} fromContact={props.message.fromContact || false} />
      )

    default:
      return null;
  }
}

const parseAttachment = (
  attachment: SimpleAttachment | ButtonAttachment | GenericAttachment | MediaAttachment 
): AttachmentUnion => {

  console.log('attachment', attachment)

  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'template' && attachment.payload.template_type === 'button') {
    return {
      type: 'buttonTemplate',
      text: attachment.payload.text ?? attachment.title,
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

function facebookInbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;
  
console.log('message.content.sentAt', message.sentAt instanceof Date)
console.log('message', message)
  console.log('inboud', messageJson)

  if (messageJson.attachment?.type === 'fallback' || messageJson.attachments?.[0].type === 'fallback') {
    return {
      text: messageJson.text ?? null,
      ...parseAttachment(messageJson.attachment || messageJson.attachments[0]),
    };
  }

  if (messageJson.attachments?.[0].type === 'image') {
    return {
      type: 'images',
      images: messageJson.attachments.map(image => {
        return parseAttachment(image);
      }),
    };
  }

  if (messageJson.attachments?.[0].type === 'story_mention') {
    return {
      type: 'story_mention',
      url: messageJson.attachment?.payload?.url || messageJson.attachments[0]?.payload?.url || null,
     sentAt: message.sentAt
    };
  }

  if (messageJson.attachment || messageJson.attachments) {
    return parseAttachment(messageJson.attachment || messageJson.attachments[0]);
  }

  if (messageJson.postback) {
    return {
      type: 'postback',
      title: messageJson.postback.title == false ? null : messageJson.postback.title,
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

function facebookOutbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  console.log('outboud', messageJson)

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

  if (messageJson.attachments?.[0].type === 'story_mention') {
    return {
      type: 'story_mention',
      url: messageJson.attachment.url || messageJson.attachments[0].url,
     sentAt: messageJson.sentAt
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

  if (messageJson.postback) {
    return {
      type: 'postback',
      title: messageJson.postback.title == false ? null : messageJson.postback.title,
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
    text: 'Unknown message type',
  };
}

import React from 'react';
import {RenderPropsUnion} from '../../props';
import {Text, Image, Video, File, CurrentLocation} from '../../components';
import {AudioClip} from 'components';
import {QuickReplies} from './components/QuickReplies';
import {
  AttachmentUnion,
  SimpleAttachment,
  ContentUnion,
  ButtonAttachment,
  GenericAttachment,
  MediaAttachment,
  WhatsAppMediaType,
} from './MetaModel';
import {
  ButtonTemplate,
  GenericTemplate,
  MediaTemplate,
  FallbackAttachment,
  StoryMention,
  StoryReplies,
  Share,
  DeletedMessage,
} from './components';
import {WhatsAppTemplate, WhatsAppMedia, WhatsAppInteractive, WhatsAppContacts} from './components/whatsApp';
import {Source} from 'model';

export const MetaRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? metaInbound(message) : metaOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

    case 'fallback':
      return <FallbackAttachment fromContact={props.message.fromContact || false} content={content} />;

    case 'postback':
      return <Text fromContact={props.message.fromContact || false} text={content.title ?? content.payload} />;

    case 'image':
      return <Image imageUrl={content.imageUrl} text={content.text} />;

    case 'images':
      return <Image images={content.images} text={content.images[0].text} />;

    case 'video':
      return <Video videoUrl={content.videoUrl} />;

    case 'audio':
      return <AudioClip audioUrl={content.audioUrl} />;

    case 'file':
      return <File fileUrl={content.fileUrl} />;

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

    //Instagram-specific
    case 'story_mention':
      return (
        <StoryMention url={content.url} sentAt={content.sentAt} fromContact={props.message.fromContact || false} />
      );

    case 'story_replies':
      return (
        <StoryReplies
          url={content.url}
          text={content.text}
          sentAt={content.sentAt}
          fromContact={props.message.fromContact || false}
        />
      );

    case 'share':
      return <Share url={content.url} fromContact={props.message.fromContact || false} />;

    case 'deletedMessage':
      return <DeletedMessage fromContact={props.message.fromContact || false} />;

    //Whatsapp Business Cloud
    case 'whatsAppTemplate':
      return <WhatsAppTemplate components={content.components} />;

    case 'whatsAppMedia':
      return <WhatsAppMedia mediaType={content.mediaType} link={content?.link} caption={content?.caption} />;

    case 'whatsAppLocation':
      return (
        <CurrentLocation
          latitude={content.latitude}
          longitude={content.longitude}
          name={content?.name}
          address={content?.address}
          fromContact={props.message.fromContact || false}
        />
      );

    case 'whatsAppInteractive':
      return (
        <WhatsAppInteractive
          action={content.action}
          header={content.header}
          body={content.body}
          footer={content.footer}
        />
      );

    case 'whatsAppContacts':
      return <WhatsAppContacts formattedName={content.formattedName} />;

    default:
      return null;
  }
}

const parseAttachment = (
  attachment: SimpleAttachment | ButtonAttachment | GenericAttachment | MediaAttachment,
  text?: string
): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
      text: text,
    };
  }

  if (attachment.type === 'audio') {
    return {
      type: 'audio',
      audioUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'file') {
    return {
      type: 'file',
      fileUrl: attachment.payload.url,
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

  //Instagram-specific
  if (attachment.type === 'share') {
    return {
      type: 'share',
      url: attachment.payload.url,
    };
  }

  return {
    type: 'text',
    text: JSON.stringify(attachment),
  };
};

function metaInbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

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
        return parseAttachment(image, messageJson.text);
      }),
    };
  }

  //Instagram-specific
  if (messageJson.attachments?.[0].type === 'story_mention' || messageJson.attachment?.type === 'story_mention') {
    return {
      type: 'story_mention',
      url: messageJson.attachments?.[0].payload.url ?? messageJson.attachment?.payload.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.reply_to) {
    return {
      type: 'story_replies',
      text: messageJson.text,
      url: messageJson.reply_to?.story?.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.is_deleted) {
    return {
      type: 'deletedMessage',
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
      text: messageJson?.text?.body ?? messageJson.text,
    };
  }

  //WhatsApp Business Cloud
  if (message.source === Source.whatsapp) {
    //Template
    if (messageJson.type === 'template' && messageJson.template?.components) {
      return {
        type: 'whatsAppTemplate',
        components: messageJson.template.components,
      };
    }

    //Media
    if (messageJson.type in WhatsAppMediaType) {
      const media = messageJson.type;
      return {
        type: 'whatsAppMedia',
        mediaType: media,
        link: messageJson[media]?.link,
        caption: messageJson[media]?.caption ?? null,
      };
    }

    //Location
    if (messageJson.type === 'location') {
      return {
        type: 'whatsAppLocation',
        longitude: messageJson.location.longitude,
        latitude: messageJson.location.latitude,
        name: messageJson.location?.name,
        address: messageJson.location?.address,
      };
    }

    //Interactive
    if (messageJson.type === 'interactive') {
      const isActionRenderable = messageJson?.interactive?.action?.button || messageJson?.interactive?.action?.buttons;
      const actionToBeRendered = isActionRenderable ? {...messageJson?.interactive?.action} : null;
      return {
        type: 'whatsAppInteractive',
        action: actionToBeRendered,
        header: messageJson.interactive?.header ?? null,
        body: messageJson.interactive?.body ?? null,
        footer: messageJson.interactive?.footer ?? null,
      };
    }

    //Contacts
    if (messageJson.type === 'contacts') {
      return {
        type: 'whatsAppContacts',
        formattedName: messageJson?.contacts[0]?.name?.formatted_name,
      };
    }
  }

  return {
    type: 'text',
    text: JSON.stringify(messageJson),
  };
}

function metaOutbound(message): ContentUnion {
  const messageJson = message?.content?.message || message?.content || message;

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

  //Instagram-specific
  if (messageJson.attachments?.[0].type === 'story_mention' || messageJson.attachment?.type === 'story_mention') {
    return {
      type: 'story_mention',
      url: messageJson.attachment?.payload.url ?? messageJson.attachments?.[0].payload.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.attachments?.[0].payload?.generic && messageJson.is_echo) {
    return {
      type: 'genericTemplate',
      elements: messageJson.attachments?.[0].payload.generic.elements,
    };
  }

  if (messageJson.reply_to) {
    return {
      type: 'story_replies',
      text: messageJson.text,
      url: messageJson.reply_to?.story?.url,
      sentAt: message.sentAt,
    };
  }

  if (messageJson.is_deleted) {
    return {
      type: 'deletedMessage',
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
      text: messageJson?.text?.body ?? messageJson.text,
    };
  }

  //WhatsApp Business Cloud
  if (message.source === Source.whatsapp) {
    //Template
    if (messageJson.type === 'template' && messageJson.template?.components) {
      return {
        type: 'whatsAppTemplate',
        components: messageJson.template.components,
      };
    }

    //Media
    if (messageJson.type in WhatsAppMediaType) {
      const media = messageJson.type;

      if (messageJson[media]?.link) {
        return {
          type: 'whatsAppMedia',
          mediaType: media,
          link: messageJson[media]?.link,
          caption: messageJson[media]?.caption ?? null,
        };
      }
    }

    //Location
    if (messageJson.type === 'location') {
      return {
        type: 'whatsAppLocation',
        longitude: messageJson.location.longitude,
        latitude: messageJson.location.latitude,
        name: messageJson.location?.name,
        address: messageJson.location?.address,
      };
    }

    //Interactive
    if (messageJson.type === 'interactive') {
      const isActionRenderable = messageJson?.interactive?.action?.button || messageJson?.interactive?.action?.buttons;
      const actionToBeRendered = isActionRenderable ? {...messageJson?.interactive?.action} : null;
      return {
        type: 'whatsAppInteractive',
        action: actionToBeRendered,
        header: messageJson.interactive?.header ?? null,
        body: messageJson.interactive?.body ?? null,
        footer: messageJson.interactive?.footer ?? null,
      };
    }

    //Contacts
    if (messageJson.type === 'contacts') {
      return {
        type: 'whatsAppContacts',
        formattedName: messageJson?.contacts[0]?.name?.formatted_name,
      };
    }
  }

  return {
    type: 'text',
    text: JSON.stringify(messageJson),
  };
}

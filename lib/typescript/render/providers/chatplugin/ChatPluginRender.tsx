import React from 'react';

import {RenderPropsUnion} from '../../props';
import {AttachmentUnion, ContentUnion, SimpleAttachment} from './chatPluginModel';
import {Text} from '../../components/Text';
import {RichText} from './components/RichText';
import {RichCard} from './components/RichCard';
import {RichCardCarousel} from './components/RichCardCarousel';
import {QuickReplies} from './components/QuickReplies';
import {Image, Video, File} from 'render/components';
import {Audio} from 'components';

export const ChatPluginRender = (props: RenderPropsUnion) => {
  return render(mapContent(props.message), props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  const defaultProps = {
    fromContact: props.message.fromContact || false,
    commandCallback: 'commandCallback' in props ? props.commandCallback : null,
  };
  const invertedProps = {...defaultProps, fromContact: !defaultProps.fromContact};
  const propsToUse = 'invertSides' in props ? invertedProps : defaultProps;

  switch (content.type) {
    case 'text':
      return <Text {...propsToUse} text={content.text} />;
    case 'suggestionResponse':
      return <Text {...propsToUse} text={content.text} />;
    case 'richText':
      return (
        <RichText
          {...propsToUse}
          text={content.text}
          fallback={content.fallback}
          containsRichText={content.containsRichtText}
          customFont={props.customFont}
        />
      );
    case 'richCard':
      return (
        <RichCard
          {...propsToUse}
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
          customFont={props.customFont}
        />
      );
    case 'richCardCarousel':
      return <RichCardCarousel {...propsToUse} cardWidth={content.cardWidth} cardContents={content.cardContents} />;
    case 'quickReplies':
      return (
        <QuickReplies
          {...propsToUse}
          text={content.text}
          attachment={content.attachment}
          quickReplies={content.quickReplies}
        />
      );

    case 'image':
      return <Image imageUrl={content.imageUrl} />;

    case 'images':
      return <Image images={content.images} />;

    case 'video':
      return <Video videoUrl={content.videoUrl} />;

    case 'file':
      return <File fileUrl={content.fileUrl} />;

    case 'audio':
      return <Audio audioUrl={content.audioUrl} />;
  }
}

function mapContent(message): ContentUnion {
  const messageContent = message.content?.message ?? message.content ?? message;

  if (messageContent.quick_replies) {
    if (messageContent.quick_replies.length > 13) {
      messageContent.quick_replies = messageContent.quick_replies.slice(0, 13);
    }

    if (messageContent.attachment || messageContent.attachments) {
      return {
        type: 'quickReplies',
        attachment: parseAttachment(messageContent.attachment || messageContent.attachments),
        quickReplies: messageContent.quick_replies,
      };
    }

    return {
      type: 'quickReplies',
      text: messageContent.text,
      quickReplies: messageContent.quick_replies,
    };
  }

  if (messageContent.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageContent;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageContent.richCard?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageContent.richCard.carouselCard.cardWidth,
      cardContents: messageContent.richCard.carouselCard.cardContents,
    };
  }

  if (messageContent.postbackData) {
    return {
      type: 'suggestionResponse',
      text: messageContent.text,
      postbackData: messageContent.postbackData,
    };
  }

  if (messageContent.containsRichText) {
    return {
      type: 'richText',
      text: messageContent.text,
      fallback: messageContent.fallback,
      containsRichtText: parseBoolean(messageContent.containsRichText),
    };
  }

  if (messageContent.text) {
    return {
      type: 'text',
      text: messageContent.text,
    };
  }

  if (messageContent.attachment) {
    return parseAttachment(messageContent.attachment);
  }

  return {
    type: 'text',
    text: 'Unsupported message type',
  };
}

const parseAttachment = (attachment: SimpleAttachment): AttachmentUnion => {
  if (attachment.type === 'image') {
    return {
      type: 'image',
      imageUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'video') {
    return {
      type: 'video',
      videoUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'file') {
    return {
      type: 'file',
      fileUrl: attachment.payload.url,
    };
  }

  if (attachment.type === 'audio') {
    return {
      type: 'audio',
      audioUrl: attachment.payload.url,
    };
  }

  return {
    type: 'text',
    text: 'Unsupported message type',
  };
};

const parseBoolean = value => (typeof value == 'boolean' ? value : /^true$/i.test(value));

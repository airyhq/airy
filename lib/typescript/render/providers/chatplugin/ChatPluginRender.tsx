import React from 'react';
import {getDefaultRenderingProps, RenderPropsUnion} from '../../props';
import {RichText} from '../../components/RichText';
import {RichCard} from '../../components/RichCard';
import {RichCardCarousel} from '../../components/RichCardCarousel';
import {Text} from '../../components/Text';
import {AttachmentUnion, ContentUnion, SimpleAttachment} from './chatPluginModel';
import {QuickReplies} from './components/QuickReplies/index';
import {RenderedContentUnion} from 'model';

export const ChatPluginRender = (props: RenderPropsUnion) => {
  return render(mapContent(props.content), props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  const defaultProps = {
    ...getDefaultRenderingProps(props),
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
          message={props.content}
          text={content.text}
          fallback={content.fallback}
          containsRichText={content.containsRichtText}
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
  }
}

function mapContent(message: RenderedContentUnion): ContentUnion {
  const messageContent = message.content.message ?? message.content;

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

  return {
    type: 'text',
    text: 'Unknown message type',
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

  return {
    type: 'text',
    text: 'Unknown message type',
  };
};

const parseBoolean = value => (typeof value == 'boolean' ? value : /^true$/i.test(value));

import React from 'react';

import {RenderPropsUnion} from '../../props';
import {ContentUnion} from './googleModel';

import {Text} from '../../components/Text';
import {Image} from '../../components/Image';
import {Suggestions} from './components/Suggestions';
import {RichCard} from './components/RichCard';
import {RichCardCarousel} from './components/RichCardCarousel';
import {RequestedLiveAgent} from './components/RequestedLiveAgent';

export const GoogleRender = (props: RenderPropsUnion) => {
  const message = props.message;
  const content = message.fromContact ? googleInbound(message) : googleOutbound(message);
  return render(content, props);
};

function render(content: ContentUnion, props: RenderPropsUnion) {
  switch (content.type) {
    case 'text':
      return <Text fromContact={props.message.fromContact || false} text={content.text} />;

    case 'requestedLiveAgent':
      return <RequestedLiveAgent />;

    case 'image':
      return <Image imageUrl={content.imageUrl} altText="image sent via GBM" />;

    case 'suggestions':
      return (
        <Suggestions
          fromContact={props.message.fromContact || false}
          text={content.text}
          image={content.image}
          fallback={content.fallback}
          suggestions={content.suggestions}
        />
      );

    case 'richCard':
      return (
        <RichCard
          title={content.title}
          description={content.description}
          media={content.media}
          suggestions={content.suggestions}
        />
      );

    case 'richCardCarousel':
      return <RichCardCarousel cardWidth={content.cardWidth} cardContents={content.cardContents} />;
  }
}

function googleInbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;

  if (messageJson.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageJson;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageJson.richCard?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCard.carouselCard.cardWidth,
      cardContents: messageJson.richCard.carouselCard.cardContents,
    };
  }

  if (messageJson.suggestionResponse) {
    return {
      type: 'text',
      text: messageJson.suggestionResponse.text,
    };
  }

  if (messageJson.authenticationResponse) {
    if (messageJson.authenticationResponse.code && !messageJson.authenticationResponse.errorDetails) {
      return {
        type: 'text',
        text: 'Authentication was successful',
      };
    }

    if (messageJson.authenticationResponse.errorDetails && !messageJson.authenticationResponse.code) {
      return {
        type: 'text',
        text: messageJson.authenticationResponse.errorDetails.errorDescription ?? 'Authentication failed',
      };
    }
  }

  if (
    messageJson.text &&
    messageJson.text.includes('https://storage.googleapis.com') &&
    messageJson.text.toLowerCase().includes('x-goog-algorithm') &&
    messageJson.text.toLowerCase().includes('x-goog-credential')
  ) {
    return {
      type: 'image',
      imageUrl: messageJson.text,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  if (messageJson?.userStatus?.requestedLiveAgent === undefined) {
    return {
      type: 'requestedLiveAgent',
    };
  }

  return {
    type: 'text',
    text: 'Unkown message type',
  };
}

function googleOutbound(message): ContentUnion {
  const messageJson = message.content.message ?? message.content;
  const maxNumberOfSuggestions = 13;

  if (messageJson.richCard?.standaloneCard) {
    const {
      richCard: {
        standaloneCard: {cardContent},
      },
    } = messageJson;

    return {
      type: 'richCard',
      ...(cardContent.title && {title: cardContent.title}),
      ...(cardContent.description && {description: cardContent.description}),
      media: cardContent.media,
      suggestions: cardContent.suggestions,
    };
  }

  if (messageJson.richCard?.carouselCard) {
    return {
      type: 'richCardCarousel',
      cardWidth: messageJson.richCard.carouselCard.cardWidth,
      cardContents: messageJson.richCard.carouselCard.cardContents,
    };
  }

  if (messageJson.suggestions) {
    if (messageJson.suggestions.length > maxNumberOfSuggestions) {
      messageJson.suggestions = messageJson.suggestions.slice(0, 13);
    }

    if (messageJson.text) {
      return {
        type: 'suggestions',
        text: messageJson.text,
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.image) {
      return {
        type: 'suggestions',
        image: {fileUrl: messageJson.image.contentInfo.fileUrl, altText: messageJson.image.contentInfo.altText},
        suggestions: messageJson.suggestions,
      };
    }

    if (messageJson.fallback) {
      return {
        type: 'suggestions',
        fallback: messageJson.fallback,
        suggestions: messageJson.suggestions,
      };
    }
  }

  if (messageJson.image) {
    return {
      type: 'image',
      imageUrl: messageJson.image.contentInfo.fileUrl,
      altText: messageJson.image.contentInfo.altText,
    };
  }

  if (messageJson.text) {
    return {
      type: 'text',
      text: messageJson.text,
    };
  }

  if (messageJson.fallback) {
    return {
      type: 'text',
      text: messageJson.fallback,
    };
  }

  return {
    type: 'text',
    text: 'Unknown message type',
  };
}

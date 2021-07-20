import {MediaContent, OutboundUnion, TextContent} from './model';

export {OutboundUnion, TextContent, MediaContent};

export const getOutboundPayload = (source: string, content: OutboundUnion) => {
  switch (content.type) {
    case 'text':
      return getTextPayload(source, content);
    case 'media':
      return getMediaPayload(source, content);
    default: {
      console.error('Unknown outbound content type ', content);
    }
  }
};

function getTextPayload(source: string, {text}: TextContent) {
  switch (source) {
    case 'google':
      return {
        text,
        representative: {
          representativeType: 'HUMAN',
        },
      };
    case 'twilio.sms':
    case 'twilio.whatsapp':
      return {
        text,
        representative: {
          representativeType: 'HUMAN',
        },
      };
    case 'facebook':
      return {
        text,
      };
    default: {
      console.error('Unknown source ', source, ' for message');
    }
  }
}

function getMediaPayload(source: string, {mediaUrl}: MediaContent) {
  switch (source) {
    case 'google':
      return {
        text: mediaUrl,
        representative: {
          representativeType: 'HUMAN',
        },
      };
    case 'twilio.sms':
    case 'twilio.whatsapp':
      return {
        MediaUrl: mediaUrl,
      };
    case 'facebook':
      // TODO https://github.com/airyhq/airy/issues/2109
      return;
    default: {
      console.error('Unknown source ', source, ' for message');
    }
  }
}

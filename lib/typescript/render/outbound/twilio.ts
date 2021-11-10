import {OutboundMapper} from './mapper';

export class TwilioMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      Body: text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    return {
      MediaUrl: mediaUrl,
    };
  }
}

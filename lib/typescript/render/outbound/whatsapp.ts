import {OutboundMapper} from './mapper';

export class WhatsAppMapper extends OutboundMapper {
  getTextPayload(text: string): {text: string} {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }
}

import {OutboundMapper} from './mapper';

export class WhatsAppMapper extends OutboundMapper {
  getTextPayload(text: string): {text: {preview_url: boolean; body: string}} {
    return {
      text: {
        preview_url: false,
        body: text,
      },
    };
  }

  isTextSupported(): boolean {
    return true;
  }
}

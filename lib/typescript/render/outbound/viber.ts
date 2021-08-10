import {OutboundMapper} from './mapper';

export class ViberMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text: text,
      type: 'text',
    };
  }

  isTextSupported(): boolean {
    return true;
  }
}

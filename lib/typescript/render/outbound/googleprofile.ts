import {OutboundMapper} from './mapper';

export class GoogleProfileMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }
}

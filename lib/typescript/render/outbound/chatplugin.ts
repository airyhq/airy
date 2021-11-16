import {OutboundMapper} from './mapper';
import {getAttachmentType} from '../services';

export class ChatpluginMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    const mediaType = getAttachmentType(mediaUrl, 'chatplugin');

    return {
      attachment: {
        type: mediaType,
        payload: {
          url: mediaUrl,
        },
      },
    };
  }
}

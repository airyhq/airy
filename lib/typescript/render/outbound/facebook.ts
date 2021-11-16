import {OutboundMapper} from './mapper';
import {getAttachmentType} from '../services';

export class FacebookMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    const mediaType = getAttachmentType(mediaUrl, 'facebook');

    return {
      attachment: {
        type: mediaType,
        payload: {
          is_reusable: true,
          url: mediaUrl,
        },
      },
    };
  }
}

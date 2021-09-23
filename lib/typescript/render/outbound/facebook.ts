import {OutboundMapper} from './mapper';
import {getAttachmentType} from '../attachments';

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
    const mediaType = getAttachmentType(mediaUrl);

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

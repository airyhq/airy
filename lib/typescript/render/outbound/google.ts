import {OutboundMapper} from './mapper';

export class GoogleMapper extends OutboundMapper {
  getTextPayload(text: string): any {
    return {
      text,
      representative: {
        representativeType: 'HUMAN',
      },
    };
  }

  isTextSupported(): boolean {
    return true;
  }

  getAttachmentPayload(mediaUrl: string): any {
    return {
      representative: {
        representativeType: 'HUMAN',
      },
      fallback: 'An image has been sent with Google Business Messages.',
      image: {
        contentInfo: {
          altText: 'An image sent via Google Business Messages.',
          fileUrl: mediaUrl,
        },
      },
    };
  }
}

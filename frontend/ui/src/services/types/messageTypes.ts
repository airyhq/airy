import {Content} from 'httpclient';

export const isTextMessage = (content: Content) => {
  if (
    content.content.text &&
    !content.content.suggestions &&
    !content.content.quick_replies &&
    !content.content.containsRichText &&
    !content.content.attachments &&
    !content.content.attachment
  ) {
    return true;
  }
};

export const isVideoMessage = (content: Content) => content.content.attachment.type === 'video';

export const isImageMessage = (content: Content) => content.content.attachment.type === 'image';

export const isButtonTemplateMessage = (content: Content) =>
  content.content.attachment.type === 'template' && content.content.attachment.payload.template_type === 'button';

export const isGenericTemplateMessage = (content: Content) =>
  content.content.attachment.type === 'template' && content.content.attachment.payload.template_type === 'generic';

export const isRichCardMessage = (content: Content) => content.content.richCard?.standaloneCard != null;

export const isRichCardCarouselMessage = (content: Content) => content.content.richCard?.carouselCard != null;

export const isRichTextMessage = (content: Content) => content.content.containsRichText != null;

export const isSuggestedReplyMessage = (content: Content) => content.content.suggestions != null;

export const isQuickReplyMessage = (content: Content) => content.content.quick_replies != null;

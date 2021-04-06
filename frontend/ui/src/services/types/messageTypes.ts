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

export const isVideoMessage = (content: Content) => {
  if (content.content.attachment.type === 'video') {
    return true;
  }
};

export const isImageMessage = (content: Content) => {
  if (content.content.attachment.type === 'image') {
    return true;
  }
};

export const isButtonTemplateMessage = (content: Content) => {
  if (content.content.attachment.type === 'template' && content.content.attachment.payload.template_type == 'button') {
    return true;
  }
};

export const isGenericTemplateMessage = (content: Content) => {
  if (content.content.attachment.type === 'template' && content.content.attachment.payload.template_type == 'generic') {
    return true;
  }
};

export const isRichCardMessage = (content: Content) => content.content.richCard?.standaloneCard != null;

export const isRichCardCarouselMessage = (content: Content) => content.content.richCard?.carouselCard != null;

export const isRichTextMessage = (content: Content) => content.content.containsRichText != null;

export const isSuggestedReplyMessage = (content: Content) => content.content.suggestions != null;

export const isQuickReplyMessage = (content: Content) => content.content.quick_replies != null;
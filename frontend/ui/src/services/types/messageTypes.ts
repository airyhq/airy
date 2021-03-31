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

export const isRichCardMessage = (content: Content) => {
  if (content.content.richCard?.standaloneCard) {
    return true;
  }
};

export const isRichCardCarouselMessage = (content: Content) => {
  if (content.content.richCard?.carouselCard) {
    return true;
  }
};

export const isRichTextMessage = (content: Content) => {
  if (content.content.containsRichText) {
    return true;
  }
};

export const isSuggestedReplyMessage = (content: Content) => {
  if (content.content.suggestions) {
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

export const isQuickReplyMessage = (content: Content) => {
  if (content.content.quick_replies) {
    return true;
  }
};

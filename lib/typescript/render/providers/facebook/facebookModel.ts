export interface Attachment {
  type: string;
}
export interface SimpleAttachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'fallback';
  payload: {
    title?: string;
    url?: string;
  };
}

export interface ButtonAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'button';
    buttons: Button[];
  };
}
export interface GenericAttachment extends Attachment {
  type: 'template';
  payload: {
    text: string;
    template_type: 'generic';
    elements: Element[];
  };
}

export interface MediaAttachment extends Attachment {
  type: 'template';
  payload: {
    template_type: 'media';
    elements: MediaAttachmentElement[];
  };
}

export interface MediaAttachmentElement {
  media_type: 'video' | 'image';
  url: string;
  buttons?: (Button | Postback)[];
}

export interface Element {
  title: string;
  subtitle?: string;
  image_url?: string;
  default_action?: {
    type: string;
    url?: string;
  };
  buttons: Button[];
}

export interface Content {
  type: string;
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface Postback extends Content {
  type: 'postback';
  title: string;
  payload: string;
}

export interface ImageContent extends Content {
  type: 'image';
  text?: string;
  imageUrl: string;
}

export interface VideoContent extends Content {
  type: 'video';
  text?: string;
  videoUrl: string;
}

export interface QuickReply {
  content_type: string;
  title: string;
  payload: string;
  image_url?: string;
}

export interface QuickRepliesContent extends Content {
  type: 'quickReplies';
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
}

export interface Button {
  type: 'web_url';
  url: string;
  title: string;
}

export interface ButtonTemplate extends Content {
  type: 'buttonTemplate';
  text: string;
  buttons: Button[];
}

export interface GenericTemplate extends Content {
  type: 'genericTemplate';
  text?: string;
  elements: Element[];
}

export interface Fallback extends Content {
  type: 'fallback';
  text?: string;
  title: string;
  url: string;
}

// Add a new facebook content model here:
export type ContentUnion =
  | TextContent
  | Postback
  | ImageContent
  | VideoContent
  | ButtonTemplate
  | GenericTemplate
  | QuickRepliesContent
  | Fallback
  | MediaAttachment
export type AttachmentUnion =
  | TextContent
  | ImageContent
  | VideoContent
  | ButtonTemplate
  | GenericTemplate
  | Fallback
  | MediaAttachment;

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

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface VideoContent extends Content {
  type: 'video';
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
  elements: Element[];
}

// Add a new facebook content model here:
export type ContentUnion =
  | TextContent
  | ImageContent
  | VideoContent
  | ButtonTemplate
  | GenericTemplate
  | QuickRepliesContent;
export type AttachmentUnion = TextContent | ImageContent | VideoContent | ButtonTemplate | GenericTemplate;

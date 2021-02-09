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

// Add a new facebook content model here:
export type ContentUnion = TextContent | ImageContent | ButtonTemplate;

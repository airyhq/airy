export interface Attachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'fallback';
  payload: {
    title?: string;
    url?: string;
  };
}

export interface Content {
  type: 'text' | 'image' | 'quickReplies' | 'video';
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
  attachment?: ContentUnionAttachment;
  quickReplies: QuickReply[];
}

// Add a new facebook content model here:
export type ContentUnion = TextContent | ImageContent | VideoContent | QuickRepliesContent;

export type ContentUnionAttachment = TextContent | ImageContent | VideoContent;

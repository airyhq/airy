export interface Content {
  type:
    | 'text'
    | 'image'
    | 'images'
    | 'video'
    | 'file'
    | 'audio'
    | 'richText'
    | 'richCard'
    | 'richCardCarousel'
    | 'quickReplies'
    | 'suggestionResponse';
}

export interface Command extends Content {
  type: 'quickReplies';
}
export interface TextContent extends Content {
  type: 'text';
  text: string;
}
export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface ImagesContent extends Content {
  type: 'images';
  images: ImageContent[];
}

export interface VideoContent extends Content {
  type: 'video';
  videoUrl: string;
}

export interface FileContent extends Content {
  type: 'file';
  fileUrl: string;
}

export interface AudioContent extends Content {
  type: 'audio';
  audioUrl: string;
}

export interface RichTextContent extends Content {
  type: 'richText';
  text: string;
  fallback: string;
  containsRichtText: boolean;
}

export enum MediaHeight {
  short = 'SHORT',
  medium = 'MEDIUM',
  tall = 'TALL',
}
export interface RichCardContent extends Content {
  type: 'richCard';
  title?: string;
  description?: string;
  media: {
    height: MediaHeight;
    contentInfo: {
      altText?: string;
      fileUrl: string;
      forceRefresh: boolean;
    };
  };
  suggestions: RichCardSuggestion[];
}

export type RichCardSuggestion = {
  reply?: {
    text: string;
    postbackData: string;
  };
  action?: {
    text: string;
    postbackData: string;
    openUrlAction?: {
      url: string;
    };
    dialAction?: {
      phoneNumber: string;
    };
  };
};

export interface RichCardCarouselContent extends Content {
  type: 'richCardCarousel';
  cardWidth: string;
  cardContents: [RichCardContent];
}

export interface SuggestionResponse extends Content {
  type: 'suggestionResponse';
  text?: string;
  postbackData: string;
}

export interface QuickReply extends Content {
  content_type: string;
  title: string;
  payload: QuickReplyCommand;
  image_url?: string;
}

export interface QuickReplyCommand extends Command {
  type: 'quickReplies';
  text?: string;
  postbackData: string;
}

export interface QuickRepliesContent extends Content {
  type: 'quickReplies';
  text?: string;
  attachment?: AttachmentUnion;
  quickReplies: QuickReply[];
}

export interface SimpleAttachment {
  type: 'image' | 'video' | 'audio' | 'file' | 'fallback';
  payload: {
    title?: string;
    url?: string;
  };
}

export interface SimpleAttachmentPayload extends Content {
  url: string;
}

export type ContentUnion =
  | TextContent
  | ImageContent
  | ImagesContent
  | VideoContent
  | FileContent
  | AudioContent
  | RichTextContent
  | RichCardContent
  | RichCardCarouselContent
  | SuggestionResponse
  | QuickRepliesContent;

export type AttachmentUnion = TextContent | ImageContent | ImagesContent | VideoContent | FileContent | AudioContent;

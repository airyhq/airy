export interface Content {
  type: 'text' | 'image' | 'suggestions';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
}

export interface SuggestedReplies {
  reply: {
    text: string;
    postbackData: string;
  };
}

export interface SuggestedActions {
  action: {
    text: string;
    postbackData: string;
    openUrlAction?: {
      url: string;
    };
    dialAction?: {
      phoneNumber: string;
    };
  };
}

export interface suggestionsContent extends Content {
  type: 'suggestions';
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestedReplies[] | SuggestedActions[];
}

export type ContentUnion = TextContent | ImageContent | suggestionsContent;

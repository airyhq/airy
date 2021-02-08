export interface Content {
  type: 'text' | 'richText' | 'richCard';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
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
  title: string;
  description: string;
  media: {
    height: MediaHeight;
    contentInfo: {
      altText: string;
      fileUrl: string;
      forceRefresh: boolean;
    };
  };
  suggestions: [
    {
      reply: {
        text: string;
        postbackData: string;
      };
    },
    {
      reply: {
        text: string;
        postbackData: string;
      };
    }
  ];
}

// TODO add a new chatplugin content model here

export type ContentUnion = TextContent | RichTextContent | RichCardContent;

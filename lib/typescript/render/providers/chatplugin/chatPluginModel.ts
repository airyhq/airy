export interface Content {
  type: 'text' | 'richCard' | 'richCardCarousel';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
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
      reply?: {
        text: string;
        postbackData: string;
      };
    }
  ];
}

export interface RichCardCarouselContent extends Content {
  type: 'richCardCarousel';
  cardWidth: string;
  cardContents: [
    {
      title?: string;
      description?: string;
      media: {
        height: MediaHeight;
        contentInfo: {
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
          reply?: {
            text: string;
            postbackData: string;
          };
        }
      ];
    }
  ];
}

export type ContentUnion = TextContent | RichCardContent | RichCardCarouselContent;

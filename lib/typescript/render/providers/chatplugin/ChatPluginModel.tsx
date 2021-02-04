export interface Content {
  type: 'text' | 'richCard';
}

export enum MediaHeight {
  short = 'SHORT',
  medium = 'MEDIUM',
  TALL = 'TALL',
}

export type RichCard = {
  type: 'richCard';
  fallback: string;
  richCard: {
    standaloneCard: {
      cardContent: {
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
      };
    };
  };
};

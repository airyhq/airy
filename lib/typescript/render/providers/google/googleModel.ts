import {Suggestion} from '../../components/RichCard';

export enum MediaHeight {
  short = 'SHORT',
  medium = 'MEDIUM',
  tall = 'TALL',
}
export interface Content {
  type: 'text' | 'image' | 'suggestions' | 'richCard' | 'richCardCarousel';
}

export interface TextContent extends Content {
  type: 'text';
  text: string;
}

export interface ImageContent extends Content {
  type: 'image';
  imageUrl: string;
  altText?: string;
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
  suggestions: Suggestion[];
}

export interface RichCardCarouselContent extends Content {
  type: 'richCardCarousel';
  cardWidth: string;
  cardContents: [RichCardContent];
}

interface SuggestedReplies {
  reply: {
    text: string;
    postbackData: string;
  };
}

interface SuggestedActions {
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

interface AuthenticationRequestSuggestion {
  authenticationRequest: {
    oauth: {
      clientId: string;
      codeChallenge: string;
      scopes: [string];
    };
  };
}

interface LiveAgentRequestSuggestion {
  liveAgentRequest: {};
}

export type SuggestionsUnion =
  | SuggestedReplies
  | SuggestedActions
  | AuthenticationRequestSuggestion
  | LiveAgentRequestSuggestion;

export interface SuggestionsContent extends Content {
  type: 'suggestions';
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestionsUnion[];
}

export type ContentUnion = TextContent | ImageContent | SuggestionsContent | RichCardContent | RichCardCarouselContent;

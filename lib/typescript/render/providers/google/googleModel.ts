export enum MediaHeight {
  short = 'SHORT',
  medium = 'MEDIUM',
  tall = 'TALL',
}
export interface Content {
  type: 'text' | 'image' | 'suggestions' | 'richCard' | 'richCardCarousel' | 'requestedLiveAgent' | 'surveyResponse';
}

export interface RequestedLiveAgent extends Content {
  type: 'requestedLiveAgent';
}

export interface SurveyResponse extends Content {
  type: 'surveyResponse';
  rating: string;
}

export interface Text extends Content {
  type: 'text';
  text: string;
}

export interface Image extends Content {
  type: 'image';
  imageUrl: string;
  altText?: string;
}

export interface RichCard extends Content {
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

export interface RichCardCarousel extends Content {
  type: 'richCardCarousel';
  cardWidth: string;
  cardContents: [RichCard];
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

export interface Suggestions extends Content {
  type: 'suggestions';
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions: SuggestionsUnion[];
}

export type ContentUnion =
  | Text
  | Image
  | Suggestions
  | RichCard
  | RichCardCarousel
  | RequestedLiveAgent
  | SurveyResponse;

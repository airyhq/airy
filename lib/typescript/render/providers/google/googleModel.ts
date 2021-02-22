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
  altText?: string;
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

export type ContentUnion = TextContent | ImageContent | SuggestionsContent;

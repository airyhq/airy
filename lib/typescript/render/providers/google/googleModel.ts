export interface Content {
  type: 'text' | 'image' | 'suggestions' | 'richText';
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

export interface RichTextContent extends Content {
  type: 'richText';
  text: string;
  fallback: string;
  containsRichtText: boolean;
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

export interface AuthenticationRequestSuggestion {
  authenticationRequest: {
    oauth: {
      clientId: string;
      codeChallenge: string;
      scopes: [string];
    };
  };
}

export interface AuthenticationRequestSuggestion {
  authenticationRequest: {
    oauth: {
      clientId: string;
      codeChallenge: string;
      scopes: [string];
    };
  };
}

export interface LiveAgentRequestSuggestion {
  liveAgentRequest: {};
}

export interface suggestionsContent extends Content {
  type: 'suggestions';
  text?: string;
  fallback?: string;
  image?: {
    fileUrl: string;
    altText: string;
  };
  suggestions:
    | SuggestedReplies[]
    | SuggestedActions[]
    | AuthenticationRequestSuggestion[]
    | LiveAgentRequestSuggestion[];
}

export type ContentUnion = TextContent | ImageContent | RichTextContent | suggestionsContent;

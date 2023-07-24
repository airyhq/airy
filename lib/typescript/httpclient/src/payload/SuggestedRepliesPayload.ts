export interface SuggestedRepliesPayload {
  message_id: string;
  suggestions: {[key: string]: Suggestion};
}

interface Suggestion {
  content: {
    text: string;
  };
}

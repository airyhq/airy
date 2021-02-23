export interface SendMessagesRequestPayload {
  conversationId: string;
  message: {
    text: string;
    representative?: {
      representativeType?: string
    }
  };
}

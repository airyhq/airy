export interface SendMessagesRequestPayload {
  conversationId: string;
  message: {
    text: string;
  };
}

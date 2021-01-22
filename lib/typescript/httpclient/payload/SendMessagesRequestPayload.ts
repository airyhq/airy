export interface SendMessagesRequestPayload {
  conversation_id: string;
  message: {
    text: string;
    type: string;
  };
}

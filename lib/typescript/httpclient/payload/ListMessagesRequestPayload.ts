export interface ListMessagesRequestPayload {
  conversationId: string;
  cursor?: string | null;
  pageSize?: number;
}

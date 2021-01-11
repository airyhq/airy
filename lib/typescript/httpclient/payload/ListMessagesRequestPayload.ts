export interface ListMessagesRequestPayload {
  conversation_id: string;
  cursor?: string | null;
  page_size?: number;
}

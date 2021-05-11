export interface ConversationInfoError extends Error {
  status: number;
  body?: any;
}

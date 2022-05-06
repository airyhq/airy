export interface Webhook {
  id?: string;
  name?: string;
  url: string;
  events?: WebhooksEventType[];
  headers?: {
    'X-Custom-Header': string;
  };
  status?: WebhooksStatus;
  signatureKey?: string;
}

export enum WebhooksEventType {
  messageCreated = 'message.created',
  messageUpdated = 'message.updated',
  conversationUpdated = 'conversation.updated',
  channelUpdated = 'channel.updated',
}

export enum WebhooksStatus {
  subscribed = 'Subscribed',
  unsubscribed = 'Unsubscribed',
}

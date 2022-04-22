export interface UpdateWebhookRequestPayload {
  id: string;
  name?: string;
  url?: string;
  events?: [string];
  headers?: {
    'X-Custom-Header': string;
  };
  status?: string;
  signatureKey?: string;
}

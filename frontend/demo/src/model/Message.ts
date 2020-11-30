export interface Attachement {
  type: string;
  payload: {
    url?: string;
    title?: string;
    name?: string;
    template_type?: string;
    text?: string;
  };
  sender?: {
    id: string;
  };
}

export interface Message {
  id?: string;
  text: string;
  sent_at: string | Date;
  attachments?: Attachement[];
  alignment?: string;
  metadata?: string;

  sender?: {
    id: string;
  };
}

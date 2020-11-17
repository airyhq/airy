export interface Message {
  id: string;
  text: string;
  sent_at: string | Date;
  alignment?: string;

  sender?: {
    id: string;
  };
}

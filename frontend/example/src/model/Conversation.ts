import { Channel } from "./Channel";

export interface Conversation {
  id: string;
  state: "OPEN" | "CLOSED";
  created_at: string;
  channel?: Channel;
  source?: Channel;
  message: {
    sent_at: Date;
  };
  unread_message_count?: number;
}

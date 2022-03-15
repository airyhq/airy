import {DeliveryState, Metadata, MetadataEvent, Source, Tag} from 'model';

interface Event {
  type: 'message.created' | 'message.updated' | 'channel.updated' | 'metadata.updated' | 'tag.updated';
}

export interface MessageCreatedPayload extends Event {
  type: 'message.created';
  payload: {
    conversation_id: string;
    channel_id: string;
    message: {
      id: string;
      content: string;
      delivery_state: DeliveryState;
      from_contact: boolean;
      sent_at: Date;
    };
  };
}
export interface MessageUpdatedPayload extends Event {
  type: 'message.updated';
  payload: {
    conversation_id: string;
    channel_id: string;
    message: {
      id: string;
      content: string;
      delivery_state: DeliveryState;
      from_contact: boolean;
      sent_at: Date;
      source: Source;
      sender: {
        id: string;
        name?: string;
        avatar_url?: string;
      };
    };
  };
}
export interface ChannelUpdatedPayload extends Event {
  type: 'channel.updated';
  payload: {
    id: string;
    metadata?: Metadata & {
      name: string;
      image_url?: string;
    };
    source: string;
    source_channel_id: string;
    connected: boolean;
  };
}

export interface MetadataUpdatedPayload extends Event {
  type: 'metadata.updated';
  payload: MetadataEvent;
}

export interface TagUpdatedPayload extends Event {
  type: 'tag.updated';
  payload: Tag;
}

export type EventPayload =
  | MessageCreatedPayload
  | MessageUpdatedPayload
  | ChannelUpdatedPayload
  | MetadataUpdatedPayload
  | TagUpdatedPayload;

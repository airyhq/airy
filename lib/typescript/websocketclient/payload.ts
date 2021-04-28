import {DeliveryState, Metadata, MetadataEvent, Tag} from 'model';

interface Event {
  type: 'message' | 'channel' | 'metadata' | 'tag';
}

export interface MessageEventPayload extends Event {
  type: 'message';
  payload: {
    conversation_id: string;
    channel_id: string;
    message: {
      id: string;
      content: string;
      delivery_state: DeliveryState;
      from_contact: boolean;
      sent_at: Date;
      metadata: any;
    };
  };
}

export interface ChannelEventPayload extends Event {
  type: 'channel';
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

export interface MetadataEventPayload extends Event {
  type: 'metadata';
  payload: MetadataEvent;
}

export interface TagEventPayload extends Event {
  type: 'tag';
  payload: Tag;
}

export type EventPayload = MessageEventPayload | ChannelEventPayload | MetadataEventPayload | TagEventPayload;

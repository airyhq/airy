import {MessageState, Metadata, MetadataEvent, SenderType} from 'httpclient';

interface Event {
  type: 'message' | 'channel' | 'metadata';
}

interface MessagePayload {
  id: string;
  content: string;
  delivery_state: MessageState;
  sender_type: SenderType;
  sent_at: Date;
  metadata: any;
}

interface ChannelPayload {
  id: string;
  metadata?: Metadata & {
    name: string;
    image_url?: string;
  };
  source: string;
  source_channel_id: string;
  connected: boolean;
}

export interface MessageEventPayload extends Event {
  type: 'message';
  payload: {
    conversation_id: string;
    channel_id: string;
    message: MessagePayload;
  };
}

export interface ChannelEventPayload extends Event {
  type: 'channel';
  payload: ChannelPayload;
}

export interface MetadataEventPayload extends Event {
  type: 'metadata';
  payload: MetadataEvent;
}

export type EventPayloadUnion = MessageEventPayload | ChannelEventPayload | MetadataEventPayload;

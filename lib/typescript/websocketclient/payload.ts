import {MessagePayload, MetadataEvent, ChannelPayload} from 'httpclient';

interface Event {
  type: 'message' | 'channel' | 'metadata';
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

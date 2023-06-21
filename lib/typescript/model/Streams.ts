export interface Streams {
  topics: string[];
  topicsInfo: {
    [topicName: string]: TopicInfo;
  };
  topic_schemas: string[];
  streams: Stream[];
  schemas: {
    [topicName: string]: Schema;
  };
  streamsInfo: {
    [streamName: string]: StreamInfo;
  };
  messages: {
    [topicName: string]: {};
  };
}

export interface TopicInfo {
  name: string;
  configs: {};
  partitions: [];
}

export interface Schema {
  id: number;
  schema: string;
  subject: string;
  version: number;
}

export interface SchemaField {
  name: string;
  default?: string | null;
  type?:
    | {
        name?: string;
        type?: string;
        symbols?: string[];
      }
    | any[];
}

export interface Stream {
  name: string;
  topic: string;
}

export interface StreamInfo {
  '@type': string;
  statementText: string;
  sourceDescription: {};
  streams: any;
  warnings: string[];
}

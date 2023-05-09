export interface Streams {
  topics: string[];
  streams: Stream[];
  schemas: {
    [topicName: string]: Schema;
  };
  messages: {
    [topicName: string]: {};
  };
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

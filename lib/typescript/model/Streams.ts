export interface Streams {
  topics: string[];
  schemas: {
    [topicName: string]: Schema;
  };
}

export interface Schema {
  id: number;
  schema: string;
  subject: string;
  version: number;
}

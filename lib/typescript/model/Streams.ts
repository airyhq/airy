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

export interface CreateStreamPayload {
  name: string;
  topics: {
    name: string;
    fields: {
      name: string;
      newName: string;
    }[];
  }[];
  joins: {
    name: string;
    field1: string;
    field2: string;
  }[];
  aggregations: string[];
  key: string;
}

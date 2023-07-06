export interface CreateTopicPayload {
  payload: {
    value_schema: string;
    records: {}[];
  };
  topicName: string;
}

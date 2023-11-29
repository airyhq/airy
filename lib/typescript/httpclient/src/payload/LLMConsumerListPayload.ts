interface LLMConsumer {
  lag: number;
  name: string;
  status: string;
  topic: string;
}

export interface LLMConsumersListPayload {
  data: LLMConsumer[];
}

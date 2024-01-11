interface LLMInfo {
  llm: string;
  llm_model: string;
  vectorDatabase: string;
}
export interface LLMInfoPayload {
  data: LLMInfo[];
}

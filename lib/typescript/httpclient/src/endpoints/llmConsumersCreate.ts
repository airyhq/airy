import {LLMConsumersCreateRequestPayload} from '../payload';

export const llmConsumersCreateDef = {
  endpoint: 'llm-consumers.create',
  mapRequest: (request: LLMConsumersCreateRequestPayload) => ({
    name: request.name,
    topic: request.topic,
    textField: request.textField,
    metadataFields: request.metadataFields,
  }),
};

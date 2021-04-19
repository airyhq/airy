import {MetadataUpsertRequestPayload} from '../payload/MetadataUpsertRequestPayload';

export const metadataUpsertDef = {
  endpoint: 'metadata.upsert',
  mapRequest: (request: MetadataUpsertRequestPayload) => ({
    id: request.id,
    subject: request.subject,
    data: request.data,
  }),
};

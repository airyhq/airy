import {UpdateContactInfoRequestPayload} from '../payload';

export const updateContactInfoDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactInfoRequestPayload) => ({
   ...request
  }),
};

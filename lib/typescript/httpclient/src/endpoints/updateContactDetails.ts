import camelcaseKeys from 'camelcase-keys';
import {UpdateContactDetailsRequestPayload} from '../payload';

export const updateContactDetailsDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactDetailsRequestPayload) => camelcaseKeys(request),
};

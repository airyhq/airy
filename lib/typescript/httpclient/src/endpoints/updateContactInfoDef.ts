import {UpdateContactInfoRequestPayload} from '../payload';

export const updateContactInfoDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactInfoRequestPayload) => ({
    ...request,
    display_name: request?.displayName,
    organization_name: request?.organizationName,
    address:{
      address_line1: request?.address?.addressLine1,
      city:request?.address?.city
    }
  }),
};

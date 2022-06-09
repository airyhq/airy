import {UpdateContactDetailsRequestPayload} from '../payload';

export const updateContactDetailsDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactDetailsRequestPayload) => ({
    ...request,
    display_name: request?.displayName,
    organization_name: request?.organizationName,
    address: {
      address_line1: request?.address?.addressLine1,
      city: request?.address?.city,
    },
  }),
};

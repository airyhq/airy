import {UpdateContactDetailsRequestPayload} from '../payload';

export const updateContactDetailsDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactDetailsRequestPayload) => ({
    display_name: request?.displayName,
    organization_name: request?.organizationName,
    address: {
      address_line1: request?.address?.addressLine1,
      city: request?.address?.city,
    },
    ...(request?.via && {
      ...(request?.via?.phone && {
        phone: request?.via?.phone,
      }),
      ...(request?.via?.email && {
        email: request?.via?.email,
      }),
    }),
  }),
};

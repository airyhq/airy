import {UpdateContactDetailsRequestPayload} from '../payload';

export const updateContactDetailsDef = {
  endpoint: 'contacts.update',
  mapRequest: (request: UpdateContactDetailsRequestPayload) => ({
    id: request.id,
    title: request.title,
    ...(request?.displayName && {
      display_name: request?.displayName,
    }),
    ...(request?.organizationName && {
      organization_name: request?.organizationName,
    }),
    ...(request?.address &&
      (request?.address?.addressLine1 || request?.address?.city) && {
        address: {
          ...(request?.address?.addressLine1 && {
            address_line1: request?.address?.addressLine1,
          }),
          ...(request?.address?.city && {
            city: request?.address?.city,
          }),
        },
      }),
    ...(request?.via && {
      via: {
        ...(request?.via?.phone && {
          phone: request?.via?.phone,
        }),
        ...(request?.via?.email && {
          email: request?.via?.email,
        }),
      },
    }),
  }),
};

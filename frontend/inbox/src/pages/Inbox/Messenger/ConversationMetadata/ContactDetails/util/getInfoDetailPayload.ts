import {UpdateContactDetailsRequestPayload} from 'httpclient/src';

export const getInfoDetailsPayload = (
  contactId: string,
  email: string,
  phone: string,
  title: string,
  address: string,
  city: string,
  organization: string
) => {
  const updatedContact: UpdateContactDetailsRequestPayload = {
    id: contactId,
  };

  if (email !== 'email') {
    updatedContact.via = {};
    updatedContact.via.email = email;
  }

  if (phone !== 'phone') {
    if (!updatedContact.via) updatedContact.via = {};
    updatedContact.via.phone = phone;
  }

  if (title !== 'title') updatedContact.title = title;

  if (address !== 'address') {
    updatedContact.address = {};
    updatedContact.address.addressLine1 = address;
  }

  if (city !== 'city') {
    if (!updatedContact.address) updatedContact.address = {};
    updatedContact.address.city = city;
  }

  if (organization !== 'company name') updatedContact.organizationName = organization;

  return updatedContact;
};

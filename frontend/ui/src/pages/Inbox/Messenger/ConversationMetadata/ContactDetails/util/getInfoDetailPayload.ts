export const getInfoDetailsPayload = (
  contactId: string,
  email: string,
  phone: string,
  title: string,
  address: string,
  city: string,
  organization: string
) => {
  const infoDetails: any = {
    id: contactId,
  };

  if (email !== 'email') {
    if (!infoDetails.via) infoDetails.via = {};
    infoDetails.via.email = email;
  }

  if (phone !== 'phone') {
    infoDetails.via = {};
    infoDetails.via.phone = phone;
  }

  if (title !== 'title') infoDetails.title = title;

  if (address !== 'address') {
    infoDetails.address = {};
    infoDetails.address.addressLine1 = address;
  }

  if (city !== 'city') {
    if (!infoDetails.address) infoDetails.address = {};
    infoDetails.address.city = city;
  }

  if (organization !== 'company name') infoDetails.organizationName = organization;

  return infoDetails;
};

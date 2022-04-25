import {UpdateContactDetailsRequestPayload} from 'httpclient/src';
import {Contact} from 'model';

export const fillContactInfo = (
  contact: Contact | UpdateContactDetailsRequestPayload,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setPhone: React.Dispatch<React.SetStateAction<string>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setCity: React.Dispatch<React.SetStateAction<string>>,
  setOrganization: React.Dispatch<React.SetStateAction<string>>
) => {
  const email = contact?.via?.email;
  const phone = contact?.via?.phone;
  const title = contact?.title;
  const address = contact?.address?.addressLine1;
  const city = contact?.address?.city;
  const organizationName = contact?.organizationName;

  email ? setEmail(email) : setEmail('email');
  phone ? setPhone(phone) : setPhone('phone');
  title ? setTitle(title) : setTitle('title');
  address ? setAddress(address) : setAddress('address');
  city ? setCity(city) : setCity('city');
  organizationName ? setOrganization(organizationName) : setOrganization('company name');
  address ? setAddress(address) : setAddress('address');
};

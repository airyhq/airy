import {UpdateContactInfoRequestPayload} from 'httpclient/src';
import {ContactInfo} from 'model';

export const fillContactInfo = (
  conversationContact: ContactInfo | UpdateContactInfoRequestPayload,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setPhone: React.Dispatch<React.SetStateAction<string>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setCity: React.Dispatch<React.SetStateAction<string>>,
  setOrganization: React.Dispatch<React.SetStateAction<string>>
) => {
  const email = conversationContact?.via?.email;
  const phone = conversationContact?.via?.phone;
  const title = conversationContact?.title;
  const address = conversationContact?.address?.addressLine1;
  const city = conversationContact?.address?.city;
  const organizationName = conversationContact?.organizationName;

  email ? setEmail(email) : setEmail('email');
  phone ? setPhone(phone) : setPhone('phone');
  title ? setTitle(title) : setTitle('title');
  address ? setAddress(address) : setAddress('address');
  city ? setCity(city) : setCity('city');
  organizationName ? setOrganization(organizationName) : setOrganization('company name');
  address ? setAddress(address) : setAddress('address');
};

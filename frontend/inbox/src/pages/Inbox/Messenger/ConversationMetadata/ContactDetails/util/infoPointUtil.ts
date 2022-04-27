import {
  cyContactEmail,
  cyContactPhone,
  cyContactTitle,
  cyContactAddress,
  cyContactCity,
  cyContactOrganization,
} from 'handles';

export const getMaxInfoCharacterLength = (infoName?: string) => {
  switch (infoName) {
    case 'email':
    case 'address':
    case 'city':
      return 30;
    case 'phone':
    case 'title':
      return 16;
    case 'organization':
      return 20;
    default:
      return 20;
  }
};

export const getDataCy = (infoName: string) => {
  switch (infoName) {
    case 'email':
      return cyContactEmail;
    case 'phone':
      return cyContactPhone;
    case 'title':
      return cyContactTitle;
    case 'address':
      return cyContactAddress;
    case 'city':
      return cyContactCity;
    case 'organization':
      return cyContactOrganization;
    default:
      return null;
  }
};

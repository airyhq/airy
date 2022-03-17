import {Source} from './Source';

export interface Contact {
  displayName: string;
  avatarUrl?: string;
}

export interface ContactInfo {
  id: string;
  displayName: string;
  avatarUrl: string;
  title: string;
  timezone: string;
  gender: string;
  locale: string;
  organizationName: string;
  via: {
    phone: string;
    email: string;
    key: string;
  };
  address: {
    organizationName: string;
    addressLine1: string;
    addressLine2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
  conversations: {
    [conversationId: string]: Source;
  };
  metadata: any;
  createdAt: Date;
}

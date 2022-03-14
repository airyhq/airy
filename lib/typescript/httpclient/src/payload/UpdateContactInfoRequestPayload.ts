export interface UpdateContactInfoRequestPayload {
    id: string;
    displayName?: string;
    avatarUrl?: string;
    title?: string;
    timezone?: string;
    gender?: string;
    locale?: string;
    organizationName?: string;
    via?: {
      phone?: string;
      email?:  string;
      key?: string;
    },
    address?: {
      organizationName?: string;
      addressLine1?: string;
      addressLine2?: string;
      postcode?: string;
      city?:string;
      state?: string;
      country?: string;
    },
    metadata?: any; 
}
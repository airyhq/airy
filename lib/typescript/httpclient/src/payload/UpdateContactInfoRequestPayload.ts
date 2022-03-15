export interface UpdateContactInfoRequestPayload {
    id:string;
    displayName?: string;
    title?: string;
    organizationName?: string;
    via?: {
      phone?: string;
      email?:  string;
    },
    address?: {
      addressLine1?: string;
      city?:string;
    },
}
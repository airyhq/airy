export interface Template {
  id: string;
  name: string;
  favourite: boolean;
  payload: string;
  content: any;
}

export interface TemplateButton {
  type: string;
  title: string;
  url?: string;
}

export interface ReceiptTemplate {
  template_type: "receipt";
  recipient_name?: string;
  order_number?: string;
  currency?: string;
  payment_method?: string;
  order_url?: string;
  timestamp?: string;
  address?: {
    street_1?: string;
    street_2?: string;
    city?: string;
    postal_code?: string;
    state?: string;
    country?: string;
  };

  // TODO
  elements: any[];
  summary: any;
}

export interface ReceiptTemplateAddress {
  street_1?: string;
  street_2?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  country?: string;
}

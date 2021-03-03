export interface Template {
  id: string;
  name: string;
  content: string;
  variables: {
    en: {
      salutation: string;
    };
  };
}

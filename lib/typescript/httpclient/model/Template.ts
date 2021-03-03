export interface Template {
  id: string;
  name: string;
  content: string;
  variables: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

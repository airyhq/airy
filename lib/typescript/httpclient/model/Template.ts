export interface Template {
  id: string;
  name: string;
  content: any;
  variables: {
    [key: string]: {
      [key: string]: string;
    };
  };
}



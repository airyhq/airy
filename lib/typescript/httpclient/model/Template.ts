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

/*
new API change: to do => update when it is merge 

export interface Template {
  id: string;
  name: string;
  content: {
    message: {
      [key: string]: string;
    }
  }
  variables: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
*/

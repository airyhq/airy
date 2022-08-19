import {Source} from './Source';

export interface Components {
  components: {
    [key: string]: {
      [key: string]: string | boolean;
    };
  };
}

export interface ComponentInfo {
  displayName: string;
  name: string;
  installed: boolean;
  availableFor: string;
  description: string;
  category: string;
  price: string;
  docs: string;
  source: Source;
}

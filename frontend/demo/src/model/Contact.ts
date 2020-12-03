import {Tag} from './Tag';

export interface Contact {
  id: string;
  info: Dictionary<string>;
  first_name: string;
  last_name: string;
  display_name: string;
  avatar_url: string;
  tags: Tag[];
}

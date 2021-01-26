import {Tag} from './Tag';

export interface Contact {
  id: string;
  displayName: string;
  avatarUrl: string;
  tags?: Tag[];
}

import {Tag} from './Tag';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string;
  tags?: Tag[];
}

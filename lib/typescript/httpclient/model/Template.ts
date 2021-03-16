import {Source} from './Message';

export interface Template {
  id: string;
  name: string;
  source: Source;
  content: string;
}

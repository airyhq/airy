import {Source} from './Source';
import {Content} from './Content';

export interface Template {
  id: string;
  content: Content;
  name: string;
  source: Source;
}

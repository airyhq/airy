import {Source} from './Message';
import {Content} from './Content';

export interface Template extends Content {
  name: string;
  source: Source;
}

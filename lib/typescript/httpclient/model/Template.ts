import {Source} from './Source';
import {Content} from './Content';

export interface Template extends Content {
  name: string;
  source: Source;
}

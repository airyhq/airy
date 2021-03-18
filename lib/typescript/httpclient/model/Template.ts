import {SourceType} from './Channel';
import {Content} from './Content';

export interface Template extends Content {
  name: string;
  source: SourceType;
}

import {SourceType} from './Message';

export interface Template {
  id: string;
  name: string;
  sourceType: SourceType;
  content: string;
  variables?: any;
}

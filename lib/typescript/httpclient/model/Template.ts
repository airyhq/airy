import {MessageSource} from './Message';

export interface Template {
  id: string;
  name: string;
  sourceType: MessageSource;
  content: string;
  variables: any;
}

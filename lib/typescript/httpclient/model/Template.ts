import {MessageSource} from './Message';

export interface Template {
  id: string;
  name: string;
  sourceType: MessageSource;
  content: any;
  variables: any;
}

import {Template} from './Template';
import {Message} from './Message';

export interface Content {
  id: string;
  content: any;
}

export type RenderedContentUnion = Message | Template | Content;

export function isFromContact(content: RenderedContentUnion) {
  if (content && 'fromContact' in content) {
    return content?.fromContact;
  } else {
    return false;
  }
}

import {Template} from './Template';
import {Message} from './Message';

export type Content = any;

export function isFromContact(content: Message | Template) {
  if (content && 'fromContact' in content) {
    return content?.fromContact;
  } else {
    return false;
  }
}

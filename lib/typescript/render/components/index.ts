import {Contact} from 'httpclient';
import {CommandUnion} from '../shared';

export interface DefaultMessageRenderingProps {
  fromContact: boolean;
  contact?: Contact;
  sentAt?: string;
  commandCallback?: (command: CommandUnion) => void;
}

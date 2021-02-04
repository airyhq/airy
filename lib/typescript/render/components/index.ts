import {Contact} from 'httpclient';

export interface DefaultMessageRenderingProps {
  fromContact: boolean;
  contact?: Contact;
  sentAt?: string;
}

import {Source} from '../model/Channel';

export interface ListTemplatesRequestPayload {
  name?: string;
  source: Source;
}

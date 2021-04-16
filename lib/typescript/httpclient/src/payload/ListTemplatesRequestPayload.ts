import {Source} from 'model/Source';

export interface ListTemplatesRequestPayload {
  name?: string;
  source: Source;
}

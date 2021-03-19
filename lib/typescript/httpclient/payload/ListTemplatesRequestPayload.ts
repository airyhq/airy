import {SourceType} from '../model/Channel';

export interface ListTemplatesRequestPayload {
  name?: string;
  source: SourceType;
}

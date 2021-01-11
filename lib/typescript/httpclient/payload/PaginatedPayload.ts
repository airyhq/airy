import {ResponseMetadataPayload} from '../payload/ResponseMetadataPayload';
export interface PaginatedPayload<T> {
  data: T[];
  responseMetadata: ResponseMetadataPayload;
}

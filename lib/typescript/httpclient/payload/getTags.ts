import { doFetchFromBackend } from '../api';
import { GetTagsResponse } from '../model';

export function getTags() {
  return doFetchFromBackend('tags.list')
    .then((response: GetTagsResponse) => {
      return response;
    })
    .catch((error: Error) => {
      return error;
    });
}
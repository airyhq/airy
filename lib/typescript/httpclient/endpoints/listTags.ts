import {doFetchFromBackend} from '../api';
import {ListTagsResponsePayload} from '../payload';
import {tagsMapper} from '../mappers/tagsMapper';

export function listTags() {
  return doFetchFromBackend('tags.list')
    .then((response: ListTagsResponsePayload) => {
      return tagsMapper(response.data);
    })
    .catch((error: Error) => {
      return error;
    });
}

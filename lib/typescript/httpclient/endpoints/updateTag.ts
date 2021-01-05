import {doFetchFromBackend} from '../api';
import {Tag} from '../model';

export function updateTag(tag: Tag) {
  return doFetchFromBackend('tags.update', {...tag})
    .then(() => Promise.resolve(true))
    .catch((error: Error) => Promise.reject(error));
}

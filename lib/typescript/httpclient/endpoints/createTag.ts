import {doFetchFromBackend} from '../api';
import {Tag, ColorTag} from '../model';
import {CreateTagRequestPayload, TagPayload} from '../payload';

export function createTag(requestPayload: CreateTagRequestPayload) {
  return doFetchFromBackend('tags.create', requestPayload)
    .then((response: TagPayload) => {
      const tag: Tag = {
        id: response.id,
        name: requestPayload.name,
        color: requestPayload.color as ColorTag,
      };
      return tag;
    })
    .catch((error: Error) => {
      return error;
    });
}

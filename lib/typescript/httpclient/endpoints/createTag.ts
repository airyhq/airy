import {doFetchFromBackend} from '../api';
import {Tag, TagColor} from '../model';
import {CreateTagRequestPayload} from '../payload';
import {TagPayload} from '../payload/TagPayload';

export function createTag(requestPayload: CreateTagRequestPayload) {
  return doFetchFromBackend('tags.create', requestPayload)
    .then((response: TagPayload) => {
      const tag: Tag = {
        id: response.id,
        name: requestPayload.name,
        color: requestPayload.color as TagColor,
      };
      return tag;
    })
    .catch((error: Error) => {
      return error;
    });
}

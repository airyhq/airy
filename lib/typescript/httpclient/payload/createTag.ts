import { doFetchFromBackend } from '../api';
import { CreateTagRequestPayload, TagPayload, Tag } from '../model';

export function createTag(requestPayload: CreateTagRequestPayload) {
  return doFetchFromBackend('tags.create', requestPayload)
    .then((response: TagPayload) => {
      const tag: Tag = {
        id: response.id,
        name: requestPayload.name,
        color: requestPayload.color,
      };
      return tag;
    })
    .catch((error: Error) => {
      return error;
    });
};
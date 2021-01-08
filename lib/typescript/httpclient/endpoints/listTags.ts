import {doFetchFromBackend} from '../api';
import {Tag} from '../model';
import {ListTagsResponsePayload} from '../payload';

const tagMapper = {
  BLUE: 'tag-blue',
  RED: 'tag-red',
  GREEN: 'tag-green',
  PURPLE: 'tag-purple',
};

const tagsMapper = (serverTags: Tag[]): Tag[] => {
  return serverTags.map(t => ({id: t.id, name: t.name, color: tagMapper[t.color] || 'tag-blue'}));
};

export function listTags() {
  return doFetchFromBackend('tags.list')
    .then((response: ListTagsResponsePayload) => {
      return tagsMapper(response.data);
    })
    .catch((error: Error) => {
      return error;
    });
}

import {doFetchFromBackend} from '../api';
import {Tag} from '../model';
import {GetTagsResponse} from '../payload';

export function getTags() {
  const colorMapper = (color: string): string => {
    switch (color) {
      case 'BLUE':
        color = 'tag-blue';
        break;
      case 'RED':
        color = 'tag-red';
        break;
      case 'GREEN':
        color = 'tag-green';
        break;
      case 'PURPLE':
        color = 'tag-purple';
        break;
      default:
        color = 'tag-blue';
    }
    return color;
  };

  const tagsMapper = (serverTags: Tag[]): Tag[] => {
    const tags: Tag[] = [];
    const _ = serverTags.map((tag: Tag) => {
      tag.color = colorMapper(tag.color);
      tags.push(tag);
    });
    return tags;
  };

  return doFetchFromBackend('tags.list')
    .then((response: GetTagsResponse) => {
      const tagsList = tagsMapper(response.data);
      return tagsList;
    })
    .catch((error: Error) => {
      return error;
    });
}

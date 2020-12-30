import {doFetchFromBackend} from '../api';
import {Tag, ColorTag} from '../model';
import {ListTagsResponsePayload} from '../payload';

const colorMapper = (color: string): ColorTag => {
  const colors = ['BLUE', 'RED', 'GREEN', 'PURPLE'];
  if (colors.includes(color)) {
    return `tag-${color.toLowerCase()}` as ColorTag;
  } else {
    return 'tag-blue' as ColorTag;
  }
};

const tagsMapper = (serverTags: Tag[]): Tag[] => {
  return serverTags.map(tag => {
    return {id: tag.id, name: tag.name, color: colorMapper(tag.color)};
  });
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

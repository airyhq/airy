import {Tag} from '../model';

const tagMapper = {
  BLUE: 'tag-blue',
  RED: 'tag-red',
  GREEN: 'tag-green',
  PURPLE: 'tag-purple',
};

export const tagsMapper = (serverTags: Tag[]): Tag[] => {
  return serverTags.map(t => ({id: t.id, name: t.name, color: tagMapper[t.color] || 'tag-blue'}));
};

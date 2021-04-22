import { Tag } from "model";

const tagMapper = {
  BLUE: 'tag-blue',
  RED: 'tag-red',
  GREEN: 'tag-green',
  PURPLE: 'tag-purple',
};

export const createTagDef = {
  endpoint: 'tags.create',
  mapResponse: (response: Tag) => ({id: response.id, name: response.name, color: tagMapper[response.color] || 'tag-blue'}),
};

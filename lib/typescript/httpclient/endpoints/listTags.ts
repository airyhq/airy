const tagMapper = {
  BLUE: 'tag-blue',
  RED: 'tag-red',
  GREEN: 'tag-green',
  PURPLE: 'tag-purple',
};

export const listTagsDef = {
  endpoint: 'tags.list',
  mapRequest: () => ({}),
  mapResponse: response => response.data.map(t => ({id: t.id, names: t.name, color: tagMapper[t.color] || 'tag-blue'})),
};

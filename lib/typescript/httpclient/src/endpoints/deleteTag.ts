export const deleteTagDef = {
  endpoint: 'tags.delete',
  mapRequest: id => ({id}),
  mapResponse: response => response,
};

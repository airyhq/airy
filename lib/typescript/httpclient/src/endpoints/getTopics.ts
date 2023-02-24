export const getTopicsDef = {
  endpoint: 'subjects',
  headers: {allowCredentials: 'true', allowedHeaders: '*'},
  mapResponse: response => response,
};

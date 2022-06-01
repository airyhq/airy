const camelcaseKeys = require('camelcase-keys');

export const listContactsDef = {
  endpoint: 'contacts.list',
  mapResponse: response => {
    return {
      data: camelcaseKeys(response.data),
      paginationData: camelcaseKeys(response.pagination_data),
    };
  },
};

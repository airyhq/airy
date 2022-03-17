/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const getContactInfoDef = {
  endpoint: 'contacts.info',
  mapRequest: request => ({
    conversation_id: request.conversationId,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['conversations']}),
};

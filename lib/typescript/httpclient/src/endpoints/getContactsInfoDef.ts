/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const getContactsInfoDef = {
  endpoint: 'contacts.info',
  mapRequest: conversationId => ({
    conversation_id: conversationId,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['conversations']}),
};
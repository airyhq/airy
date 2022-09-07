import camelcaseKeys from 'camelcase-keys';

export const getContactDetailsDef = {
  endpoint: 'contacts.info',
  mapRequest: request => ({
    ...(request.id && {id: request.id}),
    ...(request.conversationId && {conversation_id: request.conversationId}),
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['conversations']}),
};

export const resendMessagesDef = {
  endpoint: 'messages.resend',
  mapRequest: ({messageId}) => ({message_id: messageId}),
};

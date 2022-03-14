export const resendMessageDef = {
  endpoint: 'messages.resend',
  mapRequest: ({messageId}) => ({message_id: messageId}),
};

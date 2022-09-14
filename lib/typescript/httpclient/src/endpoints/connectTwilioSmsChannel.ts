import camelcaseKeys from 'camelcase-keys';

export const connectTwilioSmsChannelDef = {
  endpoint: 'channels.twilio.sms.connect',
  mapRequest: ({sourceChannelId, name, imageUrl}) => ({
    phone_number: sourceChannelId,
    name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

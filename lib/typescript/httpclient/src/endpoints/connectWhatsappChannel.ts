import camelcaseKeys from 'camelcase-keys';

export const connectWhatsappChannelDef = {
  endpoint: 'channels.whatsapp.connect',
  mapRequest: ({phoneNumberId, userToken, name, imageUrl}) => ({
    phone_number_id: phoneNumberId,
    user_token: userToken,
    name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

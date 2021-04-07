import {ConnectTwilioWhatsappRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export const connectTwilioWhatsappChannelDef = {
  endpoint: 'channels.twilio.whatsapp.connect',
  mapRequest: ({sourceChannelId, name, imageUrl}) => ({
    phone_number: sourceChannelId,
    name,
    image_url: imageUrl,
  }),
  mapResponse: response => camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']}),
};

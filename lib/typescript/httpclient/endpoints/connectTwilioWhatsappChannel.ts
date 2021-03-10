import {ChannelPayload, ConnectTwilioWhatsappRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.connectTwilioWhatsappChannel = async function(
  requestPayload: ConnectTwilioWhatsappRequestPayload
) {
  const response: ChannelPayload = await this.doFetchFromBackend('channels.twilio.whatsapp.connect', {
    phone_number: requestPayload.sourceChannelId,
    name: requestPayload.name,
    image_url: requestPayload.imageUrl,
  });

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.userData']});
};

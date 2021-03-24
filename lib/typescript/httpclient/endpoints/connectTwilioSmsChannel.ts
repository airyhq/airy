import {ConnectTwilioSmsRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../client';

export default HttpClient.prototype.connectTwilioSmsChannel = async function (
  requestPayload: ConnectTwilioSmsRequestPayload
) {
  const response = await this.doFetchFromBackend('channels.twilio.sms.connect', {
    phone_number: requestPayload.sourceChannelId,
    name: requestPayload.name,
    image_url: requestPayload.imageUrl,
  });

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']});
};

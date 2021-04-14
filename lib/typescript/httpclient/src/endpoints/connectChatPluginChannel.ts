import {ConnectChatPluginRequestPayload} from './payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');
import {HttpClient} from '../../client';

export default HttpClient.prototype.connectChatPluginChannel = async function (
  requestPayload: ConnectChatPluginRequestPayload
) {
  const response = await this.doFetchFromBackend('channels.chatplugin.connect', camelcaseKeys(requestPayload));

  return camelcaseKeys(response, {deep: true, stopPaths: ['metadata.user_data']});
};

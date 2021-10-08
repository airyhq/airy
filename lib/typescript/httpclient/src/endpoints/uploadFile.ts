import {UploadFileRequestPayload} from '../payload';
/* eslint-disable @typescript-eslint/no-var-requires */
const camelcaseKeys = require('camelcase-keys');

export const uploadFileDef = {
  endpoint: 'media.upload',
  mapRequest: (uploadFileRequest: UploadFileRequestPayload) => {
    return uploadFileRequest.file;
  },
  mapResponse: response => camelcaseKeys(response),
};

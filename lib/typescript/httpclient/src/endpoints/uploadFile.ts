import _ from 'form-data';
import {UploadFileRequestPayload} from '../payload';
import camelcaseKeys from 'camelcase-keys';

export const uploadFileDef = {
  endpoint: 'media.upload',
  mapRequest: (uploadFileRequest: UploadFileRequestPayload) => {
    return uploadFileRequest.file;
  },
  mapResponse: response => camelcaseKeys(response),
};

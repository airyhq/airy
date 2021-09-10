import {mapMessage} from 'model';
import {UploadFileRequestPayload} from '../payload';

export const uploadFileDef = {
  endpoint: 'media.uploadFile',
  mapRequest: (uploadFileRequest: UploadFileRequestPayload) => {
    return uploadFileRequest.file;
  },
  mapResponse: mapMessage,
};

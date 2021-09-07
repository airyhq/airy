import {mapMessage} from 'model';

export const uploadFileDef = {
  endpoint: 'media.uploadFile',
  mapRequest: file => file,
  mapResponse: mapMessage,
};

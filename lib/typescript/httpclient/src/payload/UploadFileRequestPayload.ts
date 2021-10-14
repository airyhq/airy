import NodeFormData from 'form-data';

export interface UploadFileRequestPayload {
  file: NodeFormData | FormData;
}

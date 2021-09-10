import {HttpClientInstance} from '../../InitializeAiryApi';

export const uploadFile = (uploadFilePayload: any): any => {
  return HttpClientInstance.uploadFile(uploadFilePayload).then(response => {
    return response;
  });
};

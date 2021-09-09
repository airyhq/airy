import {HttpClientInstance} from '../../InitializeAiryApi';

//typing here
//change naming: file or attachment?
export const uploadFile = (uploadFilePayload: any) => {
  return HttpClientInstance.uploadFile(uploadFilePayload).then(response => {
    console.log('uploadAttachment', response);
    return response;
  });
};

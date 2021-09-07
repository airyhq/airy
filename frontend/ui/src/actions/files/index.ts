import {UploadFileRequestPayload} from 'httpclient';
import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {StateModel} from '../../reducers';
import {setMetadataAction} from '../metadata';

const FILE_UPLOAD = '@@file/UPLOAD';

export const uploadFile = (uploadFilePayload: any) => {
  console.log('uploadFile payload', uploadFilePayload);
  return HttpClientInstance.uploadFile(uploadFilePayload)
    .then((response: any) => {
      console.log('uploadFile payload', uploadFilePayload);
      console.log('upload file response', response);

      //here call message send + move this to send messages

      return Promise.resolve(true);
    })
    .catch((error: any) => {
      console.log('error uploadfile action', error);
    });
};

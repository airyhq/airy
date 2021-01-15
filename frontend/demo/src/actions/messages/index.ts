import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Message, ResponseMetadataPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';

export const MESSAGES_LOADING = '@@messages/LOADING';

export const loadingMessagesAction = createAction(
  MESSAGES_LOADING,
  resolve => (messagesInfo: {conversationId: string; messages: Message[]}) => resolve(messagesInfo)
);

export function listMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.listMessages({
      conversationId,
      pageSize: 10,
    })
      .then((response: {data: Message[]; metadata: ResponseMetadataPayload}) => {
        dispatch(
          loadingMessagesAction({
            conversationId,
            messages: response.data,
          })
        );
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

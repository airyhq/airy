import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Message, ResponseMetadataPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {SendMessagesRequestPayload} from 'httpclient/payload/SendMessagesRequestPayload';

export const MESSAGES_LOADING = '@@messages/LOADING';
export const SEND_MESSAGE = '@@messages/SEND_MESSAGE';

export const loadingMessagesAction = createAction(
  MESSAGES_LOADING,
  resolve => (messagesInfo: {conversationId: string; messages: Message[]}) => resolve(messagesInfo)
);
export const sendMessagesAction = createAction(
  SEND_MESSAGE,
  resolve => (sendMessageInfo: {conversationId:string, message: Message}) => resolve(sendMessageInfo)
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
export function sendMessages(conversationId:string, message: {text: string, type: string}) {
  return async (dispatch: Dispatch<any>) => {
    debugger;
    const requestPayload: SendMessagesRequestPayload = {conversation_id: conversationId, message }
    return HttpClientInstance.sendMessages(requestPayload)
      .then((response: Message) => {
        dispatch(
          sendMessagesAction({
            conversationId,
            message: response,
          })
        );
        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
} 


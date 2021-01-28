import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Message, ResponseMetadataPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {SendMessagesRequestPayload} from '../../../../../lib/typescript/httpclient/payload/SendMessagesRequestPayload';
import {StateModel} from '../../reducers';
import {updateMessagesMetadataAction, loadingConversationAction} from '../conversations';

export const MESSAGES_LOADING = '@@messages/LOADING';
export const SEND_MESSAGE = '@@messages/SEND_MESSAGE';

export const loadingMessagesAction = createAction(
  MESSAGES_LOADING,
  resolve => (messagesInfo: {conversationId: string; messages: Message[]}) => resolve(messagesInfo)
);
export const sendMessagesAction = createAction(
  SEND_MESSAGE,
  resolve => (sendMessageInfo: {conversationId: string; message: Message}) => resolve(sendMessageInfo)
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

        if (response.metadata) {
          dispatch(updateMessagesMetadataAction(conversationId, response.metadata));
        }

        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function sendMessages(messagePayload: SendMessagesRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.sendMessages(messagePayload)
      .then((response: Message) => {
        dispatch(
          sendMessagesAction({
            conversationId: messagePayload.conversationId,
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

export function listPreviousMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>, state: () => StateModel) => {
    const metadata = state().data.conversations.all.items[conversationId].metadata;
    const cursor = metadata && metadata.next_cursor;
    const loading = metadata && metadata.loading;

    if (cursor && !loading) {
      dispatch(loadingConversationAction(conversationId));
      return HttpClientInstance.listMessages({
        conversationId,
        pageSize: 10,
        cursor: cursor,
      })
        .then((response: {data: Message[]; metadata: ResponseMetadataPayload}) => {
          dispatch(
            loadingMessagesAction({
              conversationId,
              messages: response.data,
            })
          );

          if (response.metadata) {
            dispatch(updateMessagesMetadataAction(conversationId, response.metadata));
          }

          return Promise.resolve(true);
        })
        .catch((error: Error) => {
          return Promise.reject(error);
        });
    }
  };
}

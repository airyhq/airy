import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Message} from 'model';
import {PaginatedResponse, ResendMessageRequestPayload, SendMessagesRequestPayload} from 'httpclient/src';
import {HttpClientInstance} from '../../httpClient';
import {StateModel} from '../../reducers';
import {updateMessagesPaginationDataAction, loadingConversationAction} from '../conversations';

const MESSAGES_LOADING = '@@messages/LOADING';
const MESSAGES_ADDED = '@@messages/ADDED';
const MESSAGES_UPDATED = '@@messages/UPDATED';

export const loadingMessagesAction = createAction(
  MESSAGES_LOADING,
  (messagesInfo: {conversationId: string; messages: Message[]}) => messagesInfo
)<{conversationId: string; messages: Message[]}>();

export const addMessagesAction = createAction(
  MESSAGES_ADDED,
  (messagesInfo: {conversationId: string; messages: Message[]}) => messagesInfo
)<{conversationId: string; messages: Message[]}>();

export const updatedMessagesAction = createAction(
  MESSAGES_UPDATED,
  (messagesInfo: {messageId: string}) => messagesInfo
)<{messageId: string}>();

export function listMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.listMessages({
      conversationId,
      pageSize: 10,
    }).then((response: PaginatedResponse<Message>) => {
      dispatch(
        loadingMessagesAction({
          conversationId,
          messages: response.data,
        })
      );

      if (response.paginationData) {
        dispatch(updateMessagesPaginationDataAction(conversationId, response.paginationData));
      }

      return Promise.resolve(true);
    });
  };
}

export function sendMessages(messagePayload: SendMessagesRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.sendMessages(messagePayload).then((response: Message) => {
      dispatch(
        addMessagesAction({
          conversationId: messagePayload.conversationId,
          messages: [response],
        })
      );
      return Promise.resolve(true);
    });
  };
}

export function resendMessage(messagePayload: ResendMessageRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.resendMessage(messagePayload).then(() => {
      dispatch(
        updatedMessagesAction({
          messageId: messagePayload.messageId,
        })
      );
      return Promise.resolve(true);
    });
  };
}

export function listPreviousMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>, state: () => StateModel) => {
    const paginationData = state().data.conversations.all.items[conversationId].paginationData;
    const cursor = paginationData && paginationData.nextCursor;
    const loading = paginationData && paginationData.loading;

    if (cursor && !loading) {
      dispatch(loadingConversationAction(conversationId));
      return HttpClientInstance.listMessages({
        conversationId,
        pageSize: 10,
        cursor: cursor,
      }).then((response: PaginatedResponse<Message>) => {
        dispatch(
          loadingMessagesAction({
            conversationId,
            messages: response.data,
          })
        );

        if (response.paginationData) {
          dispatch(updateMessagesPaginationDataAction(conversationId, response.paginationData));
        }

        return Promise.resolve(true);
      });
    }
  };
}

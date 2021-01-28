import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {Message, PaginatedPayload} from 'httpclient';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {StateModel} from '../../reducers';
import {updateMessagesPaginationDataAction, loadingConversationAction} from '../conversations';

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
      .then((response: PaginatedPayload<Message>) => {
        dispatch(
          loadingMessagesAction({
            conversationId,
            messages: response.data,
          })
        );

        if (response.pagination_data) {
          dispatch(updateMessagesPaginationDataAction(conversationId, response.pagination_data));
        }

        return Promise.resolve(true);
      })
      .catch((error: Error) => {
        return Promise.reject(error);
      });
  };
}

export function listPreviousMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>, state: () => StateModel) => {
    const paginationData = state().data.conversations.all.items[conversationId].paginationData;
    const cursor = paginationData && paginationData.next_cursor;
    const loading = paginationData && paginationData.loading;

    if (cursor && !loading) {
      dispatch(loadingConversationAction(conversationId));
      return HttpClientInstance.listMessages({
        conversationId,
        pageSize: 10,
        cursor: cursor,
      })
        .then((response: PaginatedPayload<Message>) => {
          dispatch(
            loadingMessagesAction({
              conversationId,
              messages: response.data,
            })
          );

          if (response.pagination_data) {
            dispatch(updateMessagesPaginationDataAction(conversationId, response.pagination_data));
          }

          return Promise.resolve(true);
        })
        .catch((error: Error) => {
          return Promise.reject(error);
        });
    }
  };
}

import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {doFetchFromBackend} from '../../api/airyConfig';
import {Message, MessagePayloadData, messageMapperData} from '../../model/Message';

export const MESSAGES_LOADING = '@@messages/LOADING';

export const loadingMessagesAction = createAction(
  MESSAGES_LOADING,
  resolve => (messagesInfo: {conversationId: string; messages: Message[]}) => resolve(messagesInfo)
);

export function fetchMessages(conversationId: string) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend('messages.list', {
      conversation_id: conversationId,
    }).then((response: MessagePayloadData) => {
      dispatch(
        loadingMessagesAction({
          conversationId,
          messages: messageMapperData(response),
        })
      );
    });
  };
}

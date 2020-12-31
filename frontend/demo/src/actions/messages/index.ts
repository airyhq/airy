import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {doFetchFromBackend} from '../../api/airyConfig';
import {Message, MessagePayloadData, messageMapperData} from '../../model/Message';

export const MESSAGES_LOADING = '@@messages/LOADING';

export const loadingMessagesAction = createAction(MESSAGES_LOADING, resolve => (messages: Message[]) =>
  resolve(messages)
);

export function fetchMessages(conversation_id: string) {
    return async (dispatch: Dispatch<any>) => {
        return doFetchFromBackend('messages.list', {
            conversation_id
        }).then((response: MessagePayloadData) => {
            dispatch(loadingMessagesAction(messageMapperData(response)));
        })
    }
}
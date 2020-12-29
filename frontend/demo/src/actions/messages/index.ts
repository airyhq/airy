import {Dispatch} from 'redux';
import {createAction} from 'typesafe-actions';
import {doFetchFromBackend} from '../../api/airyConfig';

import {MessagePayload} from '../../model/Message';
import {ResponseMetadata} from '../../model/ResponseMetadata';
import {RootState, StateModel} from '../../reducers';

export const MESSAGES_LOADING = '@@messages/LOADING';

export const loadingMessagesAction = createAction(MESSAGES_LOADING, resolve => (conversationId: string) =>
  resolve(conversationId)
);

export function fetchMessages(conversationId: string) {
    return async (dispatch: Dispatch<any>) => {
        return doFetchFromBackend('messages.list').then((response: MessagePayload) => {
            console.log(response);
            dispatch(loadingMessagesAction(conversationId));
        })
    }
}
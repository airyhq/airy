import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';

export const getContactsInfo = async (conversationId) => {

    const response = await HttpClientInstance.getContactsInfo(conversationId);

    console.log('response', response);

}
import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance,} from '../../httpClient';
import {ContactInfo} from 'model';

const CONTACTS_INFO = '@@contacts/INFO';

export const getContactsInfoAction = createAction(
  CONTACTS_INFO,
  (conversationId: string, contactsInfo: ContactInfo) => ({conversationId, contactsInfo})
)<{conversationId: string,  contactsInfo: ContactInfo}>();

export const getContactsInfo = (conversationId: string) => async (dispatch: Dispatch<any>) => {
  HttpClientInstance.getContactsInfo(conversationId).then((response:any) => {
    console.log('conversationId, response, ACTION', conversationId, response);
    dispatch(getContactsInfoAction(conversationId, response));
    return Promise.resolve(true);
  })
}

//export const updateContactsInfo = {updateContactsInfoRequestPayload: any}
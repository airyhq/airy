import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {UpdateContactInfoRequestPayload} from 'httpclient/src';
import {ContactInfo} from 'model';

const CONTACTS_INFO = '@@contacts/INFO';
const CONTACTS_UPDATE = '@@contacts/UPDATE';

export const getContactsInfoAction = createAction(
  CONTACTS_INFO,
  (conversationId: string, contactsInfo: ContactInfo) => ({conversationId, contactsInfo})
)<{conversationId: string,  contactsInfo: ContactInfo}>();

export const updateContactsInfoAction = createAction(
  CONTACTS_UPDATE,
  (conversationId: string, updatedContactsInfo: UpdateContactInfoRequestPayload) => ({conversationId, updatedContactsInfo})
)<{conversationId: string,  updatedContactsInfo: UpdateContactInfoRequestPayload}>();

export const getContactsInfo = (conversationId: string) => async (dispatch: Dispatch<any>) => {
  HttpClientInstance.getContactsInfo(conversationId).then((response:any) => {
    console.log('RESPONSE', response);
    dispatch(getContactsInfoAction(conversationId, response));
    return Promise.resolve(true);
  })
}

export const updateContactsInfo = (conversationId: string, updateContactsInfoRequestPayload: UpdateContactInfoRequestPayload) => async (dispatch:Dispatch<any>) => {
  console.log('UPDATE REQUEST', updateContactsInfoRequestPayload);
  HttpClientInstance.updateContactInfo(updateContactsInfoRequestPayload).then(() => {
    dispatch(updateContactsInfoAction(conversationId, updateContactsInfoRequestPayload))

  })
}
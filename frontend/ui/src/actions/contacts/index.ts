import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {UpdateContactDetailsRequestPayload} from 'httpclient/src';
import {Contact} from 'model';

const CONTACT_INFO = '@@contact/INFO';
const CONTACT_UPDATE = '@@contact/UPDATE';

export const getContactDetailsAction = createAction(CONTACT_INFO, (conversationId: string, contact: Contact) => ({
  conversationId,
  contact,
}))<{conversationId: string; contact: Contact}>();

export const updateContactDetailsAction = createAction(
  CONTACT_UPDATE,
  (conversationId: string, updatedContactDetails: UpdateContactDetailsRequestPayload) => ({
    conversationId,
    updatedContactDetails,
  })
)<{conversationId: string; updatedContactDetails: UpdateContactDetailsRequestPayload}>();

export const getContactDetails = (conversationId: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.getContactDetails({conversationId: conversationId}).then((response: Contact) => {
    dispatch(getContactDetailsAction(conversationId, response));
    return Promise.resolve(true);
  });
};

export const updateContactDetails =
  (conversationId: string, updateContactsInfoRequestPayload: UpdateContactDetailsRequestPayload) =>
  (dispatch: Dispatch<any>) => {
    HttpClientInstance.updateContactDetails(updateContactsInfoRequestPayload).then(() => {
      dispatch(updateContactDetailsAction(conversationId, updateContactsInfoRequestPayload));
      return Promise.resolve(true);
    });
  };

import {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {HttpClientInstance} from '../../httpClient';
import {GetContactDetailsRequestPayload, PaginatedResponse, UpdateContactDetailsRequestPayload} from 'httpclient/src';
import {Contact, Pagination} from 'model';
import {StateModel} from '../../reducers';

const CONTACT_LIST = '@@contact/LIST';
const CONTACT_INFO = '@@contact/INFO';
const CONTACT_UPDATE = '@@contact/UPDATE';
const CONTACT_DELETE = '@@contact/DELETE';

export const getContactDetailsAction = createAction(CONTACT_INFO, (id: string, contact: Contact) => ({
  id,
  contact,
}))<{id: string; contact: Contact}>();

export const updateContactDetailsAction = createAction(
  CONTACT_UPDATE,
  (contact: UpdateContactDetailsRequestPayload) => ({
    contact,
  })
)<{contact: UpdateContactDetailsRequestPayload}>();
export const listContactsAction = createAction(CONTACT_LIST, (contacts: Contact[], paginationData: Pagination) => ({
  contacts,
  paginationData,
}))<{contacts: Contact[]; paginationData: Pagination}>();

export const deleteContactAction = createAction(CONTACT_DELETE, (id: string) => id)<string>();

export const listContacts = () => async (dispatch: Dispatch<any>, state: () => StateModel) => {
  const pageSize = 54;
  const cursor = state().data.contacts.all.paginationData.nextCursor;
  HttpClientInstance.listContacts({page_size: pageSize, cursor: cursor}).then(
    (response: PaginatedResponse<Contact>) => {
      dispatch(listContactsAction(response.data, response.paginationData));
      return Promise.resolve(true);
    }
  );
};

//deleteContact is disabled in the Contacts page (temporarily)
export const deleteContact = (id: string) => async (dispatch: Dispatch<any>) => {
  HttpClientInstance.deleteContact(id).then(() => {
    dispatch(deleteContactAction(id));
    return Promise.resolve(true);
  });
};

export const getContactDetails =
  ({id, conversationId}: GetContactDetailsRequestPayload) =>
  async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.getContactDetails({id, conversationId}).then((response: Contact) => {
      dispatch(getContactDetailsAction(response.id, response));
      return Promise.resolve(response.id);
    });
  };

export const updateContactDetails =
  (updateContactDetailsRequestPayload: UpdateContactDetailsRequestPayload) => async (dispatch: Dispatch<any>) => {
    return HttpClientInstance.updateContactDetails(updateContactDetailsRequestPayload).then(() => {
      dispatch(updateContactDetailsAction(updateContactDetailsRequestPayload));
      return Promise.resolve(true);
    });
  };

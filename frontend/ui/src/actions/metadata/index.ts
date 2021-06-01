import _typesafe, {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'model';
import {HttpClientInstance} from '../../InitializeAiryApi';
import {Dispatch} from 'redux';

const SET_METADATA = '@@metadata/SET_METADATA';
const UPDATE_CONTACT = '@@metadata/UPDATE_CONTACT';

export const setMetadataAction = createAction(
  SET_METADATA,
  (metadataEvent: MetadataEvent) => metadataEvent
)<MetadataEvent>();

export const updateContactAction = createAction(UPDATE_CONTACT, (conversationId: string, displayName: string) => ({
  conversationId,
  displayName,
}))<{
  conversationId: string;
  displayName: string;
}>();

export const updateContact = (conversationId: string, displayName: string) => (dispatch: Dispatch<any>) => {
  HttpClientInstance.updateContact({conversationId, displayName}).then(() =>
    dispatch(updateContactAction(displayName))
  );
};

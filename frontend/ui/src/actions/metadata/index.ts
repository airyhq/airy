import {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'httpclient';

const SET_METADATA = '@@channel/SET_METADATA';
const SET_METADATA_LIST = '@@channel/SET_METADATA_LIST';

export const setMetadataAction = createAction(SET_METADATA, resolve => <T>(metadataEvent: MetadataEvent<T>) =>
  resolve(metadataEvent)
);

export const setMetadataListAction = createAction(
  SET_METADATA_LIST,
  resolve => <T>(metadataEvents: MetadataEvent<T>[]) => resolve(metadataEvents)
);

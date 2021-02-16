import {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'httpclient';

const SET_METADATA = '@@metadata/SET_METADATA';

export const setMetadataAction = createAction(SET_METADATA, resolve => (metadataEvent: MetadataEvent) =>
  resolve(metadataEvent)
);

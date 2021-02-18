import {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'httpclient';

const MERGE_METADATA = '@@metadata/MERGE_METADATA';
const SET_METADATA = '@@metadata/SET_METADATA';

export const setMetadataAction = createAction(SET_METADATA, resolve => (metadataEvent: MetadataEvent) =>
  resolve(metadataEvent)
);

export const mergeMetadataAction = createAction(MERGE_METADATA, resolve => (metadataEvent: MetadataEvent) =>
  resolve(metadataEvent)
);

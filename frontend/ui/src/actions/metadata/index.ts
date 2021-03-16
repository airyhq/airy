import _typesafe, {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'httpclient';

const MERGE_METADATA = '@@metadata/MERGE_METADATA';
const SET_METADATA = '@@metadata/SET_METADATA';

export const setMetadataAction = createAction(
  SET_METADATA,
  (metadataEvent: MetadataEvent) => metadataEvent
)<MetadataEvent>();

export const mergeMetadataAction = createAction(
  MERGE_METADATA,
  (metadataEvent: MetadataEvent) => metadataEvent
)<MetadataEvent>();

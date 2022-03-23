import {createAction} from 'typesafe-actions';
import {MetadataEvent} from 'model';

const SET_METADATA = '@@metadata/SET_METADATA';

export const setMetadataAction = createAction(
  SET_METADATA,
  (metadataEvent: MetadataEvent) => metadataEvent
)<MetadataEvent>();

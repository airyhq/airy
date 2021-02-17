import {StateModel} from '../reducers';
import {pickBy} from 'lodash-es';

// Filter out channels that only have metadata
// I.e. Websocket channels don't necessarily have a name so we wait for the metadata
export const allChannels = (state: StateModel) =>
  pickBy(state.data.channels, ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1);

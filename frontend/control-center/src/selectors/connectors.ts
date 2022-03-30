import {StateModel} from '../reducers';
import {pickBy} from 'lodash-es';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

// Filter out channels that only have metadata
// I.e. Websocket channels don't necessarily have a name so we wait for the metadata
export const allConnectors = (state: StateModel) =>
  pickBy(state.data.connectors, ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1);

export const allConnectorsConnected = (state: StateModel) =>
  pickBy(
    state.data.connectors,
    ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1 && restChannel.connected
  );

export const useCurrentConnector = () => {
  const {channelId} = useParams();
  return useSelector((state: StateModel) => state.data.connectors[channelId]);
};

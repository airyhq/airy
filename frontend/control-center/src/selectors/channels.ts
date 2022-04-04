import {StateModel} from '../reducers';
import {pickBy} from 'lodash-es';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

// Filter out channels that only have metadata
// I.e. Websocket channels don't necessarily have a name so we wait for the metadata
export const allChannels = (state: StateModel) =>
  pickBy(state.data.channels, ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1);

export const allChannelsConnected = (state: StateModel) =>
  pickBy(
    state.data.channels,
    ({id, metadata, ...restChannel}) => Object.keys(restChannel).length > 1 && restChannel.connected
  );

export const useCurrentChannel = () => {
  const {channelId} = useParams();
  return useSelector((state: StateModel) => state.data.channels[channelId]);
};

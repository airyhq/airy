import {ChannelsPayload} from '../payload/ChannelsPayload';
import {Channel} from '../model';

export const channelsMapper = (payload: ChannelsPayload, source?: string): Channel[] => {
  return payload.data.map(
    (entry: Channel): Channel => ({
      source,
      ...entry,
    })
  );
};

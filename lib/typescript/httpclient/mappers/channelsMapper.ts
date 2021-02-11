import {ChannelsPayload} from '../payload/ChannelsPayload';
import {channelMapper} from './channelMapper';
import {Channel} from '../model';

export const channelsMapper = (payload: ChannelsPayload): Channel[] => payload.data.map(channelMapper);

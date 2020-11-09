import {ActionType, getType} from 'typesafe-actions';
// import {differenceBy} from 'lodash-es';
// import * as actions from '../../../actions/channels';
// import {Channel} from '/model/Channel';

// type Action = ActionType<typeof actions>;

// export type ChannelsState = {
//   loading: boolean;
//   error: any;
//   data: Array<{}>;
//   allPages: Array<{}>;
//   query?: string;
// };

// export interface ChannelsType {
//   channels: {
//     data: Array<Channel>;
//     query: string;
//   };
// }

// export const initialState = {
//   loading: false,
//   error: '',
//   data: [],
//   allPages: [],
// };

// const channelsReducer = (state = initialState, action: Action): ChannelsState => {
//   switch (action.type) {
//     case getType(actions.channelsSetAllFbPagesAction):
//       return {
//         ...state,
//         allPages: differenceBy(action.payload, state.data, 'external_channel_id'),
//       };

//     case getType(actions.channelsSetAction):
//       return {
//         ...state,
//         data: action.payload,
//       };

//     case getType(actions.channelsConnectAction):
//       return {
//         ...state,
//         data: [...state.data, action.payload],
//         allPages: state.allPages.filter(page => page.external_channel_id !== action.payload.external_channel_id),
//       };

//     case getType(actions.channelsFilterAction):
//       return {
//         ...state,
//         query: action.payload,
//       };

//     case getType(actions.channelsDisconnectAction):
//       return {
//         ...state,
//         data: state.data.filter(channel => channel.external_channel_id !== action.payload.external_channel_id),
//         allPages: state.allPages.map(page => {
//           return page.external_channel_id === action.payload.external_channel_id
//             ? {...page, connected: false, loading: false}
//             : page;
//         }),
//       };

//     case getType(actions.channelsAwaitAction):
//       return {
//         ...state,
//         data: state.data.map(channel =>
//           channel.external_channel_id === action.payload ? {...channel, loading: true} : channel
//         ),
//         allPages: state.allPages.map(channel =>
//           channel.external_channel_id === action.payload ? {...channel, loading: true} : channel
//         ),
//       };
//     case getType(actions.channelsErrorAction):
//     case getType(actions.channelsDisconnectErrorAction):
//       return {
//         ...state,
//         error: action.payload,
//       };

//     default:
//       return state;
//   }
// };

// export default channelsReducer;

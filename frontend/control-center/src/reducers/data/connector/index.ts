import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/connector';
//import {getSourceForComponent} from 'model';

type Action = ActionType<typeof actions>;

export type ConnectorsConfig = {
  [key: string]: {[key: string]: string};
};

const defaultState = {};

export default function connectorsReducer(state = defaultState, action: Action): ConnectorsConfig {
  switch (action.type) {
    //save connectors configuration
    // case getType(actions.saveClientConfigAction):
    //   return {
    //     ...state,
    //     // Aggregate services on their component name
    //     components: getComponents(action.payload),
    //     clusterVersion: getClusterVersion(action.payload) || 'unknown',
    //   };

    //rename updateConnectorConfigurationAction
    case getType(actions.updateConnectorConfigurationAction):
      console.log('update connectorConfig', action);
      return {
        ...state,
        [action.payload.components[0].name]: {
          ...action.payload.components[0].data,
        },
      };
    default:
      return state;
  }
}

//{
//     ...state.components,
//     [action.payload.components[0].name]: {
//       ...state.components[action.payload.components[0].name],
//       enabled: action.payload.components[0].enabled,
//       configuration: {...action.payload.components[0].data},
//     },
//   }

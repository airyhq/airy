import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/connector';

type Action = ActionType<typeof actions>;

export type ConnectorsConfig = {
  [key: string]: any;
};

const defaultState = {};

export default function connectorsReducer(state = defaultState, action: Action): ConnectorsConfig {
  switch (action.type) {
    case getType(actions.getComponentsAction):
      return {
        ...state,
        ...action.payload.components.sources,
        ['dialogflow-connector']: {...action.payload.components.dialogflow.connector},
      };
    case getType(actions.updateConnectorConfigurationAction): {
      let name = action.payload.components[0].name;
      if (name.includes('enterprise')) {
        name = name.replace('enterprise-', '');
      }
      return {
        ...state,
        [name]: {
          ...action.payload.components[0].data,
        },
      };
    }
    default:
      return state;
  }
}

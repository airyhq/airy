import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';
import {getClusterVersion, getComponents} from 'model';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {[key: string]: {enabled?: boolean; healthy?: boolean; services?: {name: string; healthy: boolean}[]}};
  clusterVersion: string;
};

export const isComponentHealthy = (config: Config, component: string): boolean =>
  config.components?.[component]?.healthy;

const defaultState = {
  components: {},
  clusterVersion: '',
};

export default function configReducer(state = defaultState, action: Action): Config {
  switch (action.type) {
    case getType(actions.saveClientConfigAction):
      return {
        ...state,
        // Aggregate services on their component name
        components: getComponents(action.payload),
        clusterVersion: getClusterVersion(action.payload) || 'unknown',
      };
    case getType(actions.enableDisableComponentAction):
      return {
        ...state,
        components: {
          ...state.components,
          [action.payload.components[0].name]: {
            ...state.components[action.payload.components[0].name],
            enabled: action.payload.components[0].enabled,
          },
        },
      };
    default:
      return state;
  }
}

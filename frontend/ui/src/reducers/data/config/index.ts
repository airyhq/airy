import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';
import {getComponents, Config as ModelConfig, getClusterVersion} from 'model';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {[key: string]: {enabled: boolean; healthy: boolean}};
  tagConfig: ModelConfig['tagConfig'];
  clusterVersion: string;
};

export const isComponentHealthy = (config: Config, component: string): boolean =>
  config.components?.[component]?.healthy;

const defaultState = {
  components: {},
  tagConfig: {colors: {}},
  clusterVersion: '',
};

export default function configReducer(state = defaultState, action: Action): Config {
  switch (action.type) {
    case getType(actions.saveClientConfig):
      return {
        ...state,
        // Aggregate services on their component name
        components: getComponents(action.payload),
        tagConfig: action.payload.tagConfig,
        clusterVersion: getClusterVersion(action.payload),
      };
    default:
      return state;
  }
}

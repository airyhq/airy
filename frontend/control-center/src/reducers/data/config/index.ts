import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';
import {getComponents} from 'model';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {[key: string]: {enabled: boolean; healthy: boolean}};
};

export const isComponentHealthy = (config: Config, component: string): boolean =>
  config.components?.[component]?.healthy;

const defaultState = {
  components: {},
};

export default function configReducer(state = defaultState, action: Action): Config {
  switch (action.type) {
    case getType(actions.saveClientConfig):
      return {
        ...state,
        // Aggregate services on their component name
        components: getComponents(action.payload),
      };
    default:
      return state;
  }
}

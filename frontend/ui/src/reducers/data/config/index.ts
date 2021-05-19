import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {[key: string]: {enabled: boolean; healthy: boolean}};
};

const defaultState = {
  components: {},
};

export default function configReducer(state = defaultState, action: Action): Config {
  switch (action.type) {
    case getType(actions.saveClientConfig):
      let components = action.payload.components;
      return {
        ...state,
        // Aggregate services on their component name
        components: Object.keys(components).reduce((agg, key) => {
          const {healthy, enabled, component} = components[key];
          return {
            ...agg,
            [component]: {
              enabled,
              // A component is only healthy if all its services are healthy
              healthy: agg[component] ? agg[component].healthy && healthy : healthy,
            },
          };
        }, {}),
      };
    default:
      return state;
  }
}

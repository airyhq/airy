import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {[key: string]: {enabled: boolean}};
};

const defaultState = {
  components: {},
};

export default function configReducer(state = defaultState, action: Action): Config {
  switch (action.type) {
    case getType(actions.saveClientConfig):
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}

import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/config';

type Action = ActionType<typeof actions>;

export type Config = {
  components: {
    'sources-chatplugin': {
      enabled: boolean;
    };
    'sources-facebook': {
      enabled: boolean;
    };
    'sources-google': {
      enabled: boolean;
    };
    'sources-twilio': {
      enabled: boolean;
    };
  };
  features: {};
};

const defaultState = {
  components: {
    'sources-chatplugin': {
      enabled: false,
    },
    'sources-facebook': {
      enabled: false,
    },
    'sources-google': {
      enabled: false,
    },
    'sources-twilio': {
      enabled: false,
    },
  },
  features: {},
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

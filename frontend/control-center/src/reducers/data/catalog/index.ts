import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/catalog';

type Action = ActionType<typeof actions>;

// export interface Catalog {{
//   name: string;
//   repository: string;
//   installed: boolean;
// }
// }[]

const defaultState = {};

const formatName = (name: string) => {
  return name.split('/').pop();
};

export default function connectorsReducer(state = defaultState, action: Action) {
  switch (action.type) {
    case getType(actions.listComponentsAction):
      return {
        ...state,
        ...action.payload.components,
      };
    case getType(actions.installComponentAction): {
      const formattedName = formatName(action.payload.name);
      return {
        ...state,
        [formattedName]: {
          ...state[formattedName],
          installed: true,
        },
      };
    }
    case getType(actions.uninstallComponentAction): {
      const formattedName = formatName(action.payload.name);
      return {
        ...state,
        [formattedName]: {
          ...state[formattedName],
          installed: false,
        },
      };
    }
    default:
      return state;
  }
}

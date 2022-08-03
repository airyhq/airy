import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/catalog';

type Action = ActionType<typeof actions>;

export interface CatalogConfig {
  [key: string]: {
    displayName: string;
    name: string;
    installed: boolean;
    availableFor: string;
    description: string;
    category: string;
    price: string;
  };
}

const defaultState = {};

export default function connectorsReducer(state = defaultState, action: Action): CatalogConfig {
  switch (action.type) {
    case getType(actions.listComponentsAction):
      return {
        ...state,
        ...action.payload.components,
      };
    case getType(actions.installComponentAction): {
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          installed: true,
        },
      };
    }
    case getType(actions.uninstallComponentAction): {
      return {
        ...state,
        [action.payload.name]: {
          ...state[action.payload.name],
          installed: false,
        },
      };
    }
    default:
      return state;
  }
}

import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/catalog';
import {removePrefix} from '../../../services';

type Action = ActionType<typeof actions>;

export interface CatalogConfig {
  [key: string]: {repository: string; installed: boolean};
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
      const formattedName = removePrefix(action.payload.name);
      return {
        ...state,
        [formattedName]: {
          ...state[formattedName],
          installed: true,
        },
      };
    }
    case getType(actions.uninstallComponentAction): {
      const formattedName = removePrefix(action.payload.name);
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

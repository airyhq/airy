import {ComponentInfo} from 'model';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/catalog';

type Action = ActionType<typeof actions>;

export interface CatalogConfig {
  [key: string]: ComponentInfo;
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
          installationStatus: 'pending',
        },
      };
    }
    case getType(actions.updateComponentInstallationStatusAction): {
      return {
        ...state,
        [action.payload.status]: {
          ...state[action.payload.status],
          installationStatus: 'pending',
        },
      };
    }
    default:
      return state;
  }
}

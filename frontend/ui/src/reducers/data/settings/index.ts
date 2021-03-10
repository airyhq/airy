import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/settings';

type Action = ActionType<typeof actions>;

export interface ColorSettings {
  default: string;
  background: string;
  font: string;
  position: number;
  border: string;
}

export type Settings = {
  colors: {[id: string]: ColorSettings};
};

const defaultState = {
  colors: {},
};

export default function tagsReducer(state = defaultState, action: Action): Settings {
  switch (action.type) {
    case getType(actions.fetchSettings):
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

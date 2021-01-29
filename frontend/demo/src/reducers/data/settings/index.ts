import {ActionType} from 'typesafe-actions';
import {DataState} from '../..';
import * as actions from '../../../actions/settings';

type Action = ActionType<typeof actions>;

export type SettingsState = {
  data: DataState;
};

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
    case actions.ADD_SETTINGS_TO_STORE:
      return {
        ...state,
        colors: action.colors.colors,
      };
    default:
      return state;
  }
}

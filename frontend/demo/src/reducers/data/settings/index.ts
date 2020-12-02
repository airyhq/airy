import {ADD_SETTINGS_TO_STORE} from '../../../actions/settings';
import {DataState} from '../../data';

export type SettingsState = {
  data: DataState;
};

export type Settings = {
  colors: any[]
};

const defaultState = {
  colors: [],
};

export default function tagsReducer(state = defaultState, action): Settings {
  switch (action.type) {
    case ADD_SETTINGS_TO_STORE:
      return {
        ...state,
        colors: action.colors.colors,
      };
    default:
      return state;
  }
}

import {ActionType} from 'typesafe-actions';
import * as actions from '../../../actions/settings';

type Action = ActionType<typeof actions>;

export type Settings = {
  colors: {};
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

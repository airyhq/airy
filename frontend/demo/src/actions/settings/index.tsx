import _, {Dispatch} from 'redux';

import {fakeData} from '../../pages/Tags/FAKESETTINGS';

export const ADD_SETTINGS_TO_STORE = 'ADD_SETTINGS_TO_STORE';

export function fetchSettings() {
  return {
    type: ADD_SETTINGS_TO_STORE,
    colors: fakeData(),
  };
}

export function fakeSettingsAPICall() {
  return function(dispatch: Dispatch<any>) {
    dispatch(fetchSettings());
  };
}

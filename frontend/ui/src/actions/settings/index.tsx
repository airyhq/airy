import _, {Dispatch} from 'redux';
import {fakeData} from '../../pages/Tags/FAKESETTINGS';
import {createAction} from 'typesafe-actions';

const ADD_SETTINGS_TO_STORE = 'ADD_SETTINGS_TO_STORE';

export const fetchSettings = createAction(ADD_SETTINGS_TO_STORE, resolve => () => resolve(fakeData()));

export const fakeSettingsAPICall = () => (dispatch: Dispatch<any>) => dispatch(fetchSettings());

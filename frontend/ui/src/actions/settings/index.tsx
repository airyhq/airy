import _, {Dispatch} from 'redux';
import _typesafe, {createAction} from 'typesafe-actions';
import {fakeData} from '../../pages/Tags/FAKESETTINGS';
import {Settings} from '../../reducers/data/settings';

const ADD_SETTINGS_TO_STORE = 'ADD_SETTINGS_TO_STORE';

export const fetchSettings = createAction(ADD_SETTINGS_TO_STORE, () => fakeData())<Settings>();

export const fakeSettingsAPICall = () => (dispatch: Dispatch<any>) => dispatch(fetchSettings());

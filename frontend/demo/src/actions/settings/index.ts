import {createAction} from 'typesafe-actions';
import _, {Dispatch} from 'redux';

const SET_SETTINGS = '@@settings/SET';

export const updateSettings = createAction(SET_SETTINGS, resolve => (settings: Dict<boolean>) => resolve(settings));

export const fetchSettings = user => {
  return function(dispatch: Dispatch) {
    // return AiryAPIWithAuth.fetchFromBackend('settings', {
    //   client_id: 'web',
    //   client_version: 'web',
    //   organization_id: getOrganizationId(user),
    //   user_id: user.id,
    // }).then(response => dispatch(updateSettings(response)));
  };
};

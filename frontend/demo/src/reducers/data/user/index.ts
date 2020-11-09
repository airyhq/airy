import {ActionType, getType} from 'typesafe-actions';
import {cloneDeep} from 'lodash-es';
import {User} from '../../../model/User';

import * as actions from '../../../actions/user';
import {getUserFromStore, storeUserData} from '../../../api/webStore';

type Action = ActionType<typeof actions>;

export const initialState = {
  id: '',
  email: '',
  first_name: '',
  last_name: '',
  fbLoggedIn: false,
  organizations: [],
  refresh_token: '',
  error: '',
};

const updateOrg = (state, {id, name}) => {
  const newState = cloneDeep(state);
  const {organizations} = newState;
  const org = organizations.findIndex(org => org.id === id);
  organizations[org].name = name;
  return newState;
};

const userReducer: any = (state = {...initialState, ...getUserFromStore()}, action: Action): User | {} => {
  switch (action.type) {
    case getType(actions.setCurrentUserAction):      
      storeUserData(action.payload);
      return {
        ...state,
        ...action.payload,
      };

    case getType(actions.userAuthErrorAction):
      return {
        ...state,
        error: action.payload.toString(),
      };

    case getType(actions.facebookLoggedIn):
      return {
        ...state,
        fbLoggedIn: true,
        fbToken: action.payload,
      };

    case getType(actions.authRenameAction):
      return updateOrg(state, action.payload);

    case getType(actions.authRenameErrorAction):
      return {
        ...state,
        error: action.payload.toString(),
      };

    default:
      return state;
  }
};

export default userReducer;

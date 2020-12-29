import {ActionType, getType} from 'typesafe-actions';
import {User} from 'httpclient';
import * as actions from '../../../actions/user';
import {getUserFromStore, storeUserData} from 'httpclient';

type Action = ActionType<typeof actions>;

export const initialState = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  error: '',
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

    default:
      return state;
  }
};

export default userReducer;

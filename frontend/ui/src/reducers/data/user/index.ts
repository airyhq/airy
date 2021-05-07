import {ActionType, getType} from 'typesafe-actions';
import {User} from 'model';
import * as actions from '../../../actions/config';

type Action = ActionType<typeof actions>;

const userReducer: any = (state = {}, action: Action): User | {} => {
  switch (action.type) {
    case getType(actions.saveClientConfig):
      return {
        ...action.payload.userProfile,
      };
    default:
      return state;
  }
};

export default userReducer;

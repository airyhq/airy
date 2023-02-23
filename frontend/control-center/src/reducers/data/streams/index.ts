import {Streams} from 'model/Streams';
import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/streams';

type Action = ActionType<typeof actions>;

const defaultState = {
  topics: [],
};

export default function configReducer(state = defaultState, action: Action): Streams {
  switch (action.type) {
    case getType(actions.setTopicsAction):
      return {
        ...state,
        topics: action.payload,
      };
    default:
      return state;
  }
}

import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/tags';
import {Tag} from 'model';
import {omit, keyBy} from 'lodash-es';

type Action = ActionType<typeof actions>;

export type Tags = {
  all: {
    [tagId: string]: Tag;
  };
  error: string;
};

const defaultState = {
  all: {},
  error: '',
};

const errorMessage = (status: number | string) => {
  switch (status) {
    case 'empty':
      return 'Please enter a name for the tag';
    case 400:
    case 422:
      return 'A tag with this name already exists, please choose a different name';
    case 406:
      return 'Please try again later';
    default:
      return '';
  }
};

export default function tagsReducer(state = defaultState, action: Action): any {
  switch (action.type) {
    case getType(actions.fetchTagAction):
      return {
        ...state,
        all: keyBy(action.payload, 'id'),
      };
    case getType(actions.deleteTagAction):
      return {
        ...state,
        all: omit(state.all, action.payload),
      };
    case getType(actions.upsertTagAction): {
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.id]: action.payload,
        },
      };
    }
    case getType(actions.errorTagAction):
      return {
        ...state,
        error: errorMessage(action.payload),
      };
    default:
      return state;
  }
}

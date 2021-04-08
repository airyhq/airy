import {ActionType, getType} from 'typesafe-actions';
import * as actions from '../../../actions/tags';
import {Tag} from 'model';
import {DataState} from '../../data';

type Action = ActionType<typeof actions>;

export type TagState = {
  data: DataState;
};

export type Tags = {
  all: Tag[];
  query: string;
  error: string;
};

const defaultState = {
  all: [],
  query: '',
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
        all: action.payload,
      };
    case getType(actions.deleteTagAction):
      return {
        ...state,
        all: state.all.filter((tag: Tag) => tag.id !== action.payload),
      };
    case getType(actions.addTagAction): {
      let updatedTag = false;
      const mappedTags = state.all.map((tag: Tag) => {
        if (tag.id === action.payload.id) {
          updatedTag = true;
          return {
            ...tag,
            ...action.payload,
          };
        }
        return tag;
      });

      return {
        ...state,
        all: updatedTag ? mappedTags : state.all.concat([action.payload]),
      };
    }
    case getType(actions.editTagAction):
      return {
        ...state,
        all: state.all.map((tag: Tag) => (tag.id === action.payload.id ? action.payload : tag)),
      };
    case getType(actions.errorTagAction):
      return {
        ...state,
        error: errorMessage(action.payload),
      };
    case getType(actions.filterTagAction):
      return {
        ...state,
        query: action.payload,
      };
    default:
      return state;
  }
}

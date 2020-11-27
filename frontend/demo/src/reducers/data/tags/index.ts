import {
  ADD_TAGS_TO_STORE,
  UPSERT_TAG,
  DELETE_TAG,
  EDIT_TAG,
  ERROR_TAG,
  SET_TAG_FILTER
} from "../../../actions/tags";
import { Tag } from "../../../model/Tag";
import { DataState } from "../../data";

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
  query: "",
  error: ""
};

const errorMessage = status => {
  switch (status) {
    case "empty":
      return "Please enter a name for the tag";
    case 400:
    case 422:
      return "A tag with this name already exists, please choose a different name";
    case 406:
      return "Please try again later";
    default:
      return "";
  }
};

export default function tagsReducer(state = defaultState, action): Tags {
  switch (action.type) {
    case ADD_TAGS_TO_STORE:
      console.log("NOW")
      return {
        ...state,
        // all: state.all.concat(action.tagData)
        // all: action.tagData,
      };
    case DELETE_TAG:
      return {
        ...state,
        all: state.all.filter(tag => tag.id !== action.tagData.tag_id)
      };
    case UPSERT_TAG:
      let updatedTag = false;
      const mappedTags = state.all.map(tag => {
        if (tag.id === action.tagData.id) {
          updatedTag = true;
          return {
            ...tag,
            ...action.tags
          };
        }

        return tag;
      });

      return {
        ...state,
        all: updatedTag ? mappedTags : state.all.concat([action.tagData])
      };
    case EDIT_TAG:
      return {
        ...state,
        all: state.all.map(tag =>
          tag.id === action.tagData.id ? action.tagData : tag
        )
      };
    case ERROR_TAG:
      return {
        ...state,
        error: errorMessage(action.tagData.status)
      };
    case SET_TAG_FILTER:
      return {
        ...state,
        query: action.payload
      };
    default:
      return state;
  }
}

import { createAction } from "typesafe-actions";
import _, { Dispatch } from "redux";

import { doFetchFromBackend } from "../../api/airyConfig";
import { Tag, TagPayload, CreateTagRequestPayload } from '../../model/Tag';


// import {addTagToConversation} from '../contacts';

export const UPSERT_TAG = "UPSERT_TAG";
export const DELETE_TAG = "DELETE_TAG";
export const EDIT_TAG = "EDIT_TAG";
export const ERROR_TAG = "ERROR_TAG";
export const ADD_TAGS_TO_STORE = "ADD_TAGS_TO_STORE";
export const SET_TAG_FILTER = "SET_TAG_FILTER";

// export function getTags(query: string = "") {
//   return function(dispatch: Dispatch<any>) {
//     console.log("GETTAGS");
//     return doFetchFromBackend("tags.list", {}).then(({ tags }) => {
//       console.log(tags)
//       dispatch({ tags, type: ADD_TAGS_TO_STORE });
//     });
//   };
// }

export function fetchTags(tags: Tag[]) {
  console.log("FETCH")
  console.log(tags);
  return {
    type: ADD_TAGS_TO_STORE,
    tagData: tags,
  }
}

export function addTag(id: string, name: string, color: string, count: number) {
  return {
    type: ADD_TAGS_TO_STORE,
    tagData: {
        id: id,
        name: name,
        color: color,
        count: count,
    }
  }
}

export function editedTag(
  id: string,
  name: string,
  color: string,
  count: number
) {
  return {
    type: EDIT_TAG,
    tagData: {
      id,
      name,
      color,
      count
    }
  };
}

export function errorTag({ status }) {
  return {
    type: ERROR_TAG,
    tagData: {
      status
    }
  };
}

export function deleteConversationTag(tagId: string) {
  return {
    type: DELETE_TAG,
    tagData: {
      tag_id: tagId
    }
  };
}

// export function createTag(requestPayload: CreateTagRequestPayload) {
//   return async (dispatch: Dispatch<any>) => {
//     return doFetchFromBackend("tags.create", requestPayload).then((response: TagPayload) => {
//     }).then(tag => {
//           console.log("WORKS");
//         //   console.log(tag);
//         // dispatch(upsertConversationTag(tag));
//         // contactId && dispatch(addTagToConversation(organizationId, contactId, tag.id, name, color));
//         return true;
//       })
//       .catch(error => {
//         dispatch(errorTag(error));
//         return false;
//       });
//   };
// };

export function getTags(query: string = "") {
  return function(dispatch: Dispatch<any>) {
    return doFetchFromBackend("tags.list").then((response: Tag[]) => {
      console.log(response);
        // dispatch({ response, type: ADD_TAGS_TO_STORE });
        dispatch(fetchTags(response));
    })
  }
}


export function createTag(requestPayload: CreateTagRequestPayload) {
  return async (dispatch: Dispatch<any>) => {
    return doFetchFromBackend("tags.create", requestPayload).then((response: TagPayload) => {
        dispatch(addTag(response.id, requestPayload.name, requestPayload.color, 0))
        return true;
    }).catch(error => {
        dispatch(errorTag(error))
        return false;
    })
  }
}

export function updateTag(
  tagId: string,
  name: string,
  color: string,
  count: number
) {
  return function(dispatch: Dispatch<any>) {
    doFetchFromBackend("tags.update", {
      id: tagId,
      name: name,
      color: color
    }).then(tag => dispatch(editedTag(tagId, name, color, count)));
  };
}

export function deleteTag(tagId: string) {
  return function(dispatch: Dispatch<any>) {
    doFetchFromBackend("tags.delete", {
      id: tagId
    }).then(() => {
      dispatch(deleteConversationTag(tagId));
    });
  };
}

export function filterTags(filter) {
  return function(dispatch: Dispatch<any>) {
    dispatch({
      type: SET_TAG_FILTER,
      payload: filter
    });
  };
}

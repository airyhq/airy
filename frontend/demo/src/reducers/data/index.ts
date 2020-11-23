import _, { combineReducers, Reducer } from "redux-starter-kit";
import { User } from "../../model/User";
import { Tags } from "./tags";

import user from "./user";
import tags from "./tags";

export type DataState = {
  user: User;
  tags: Tags;
};

const reducers: Reducer = combineReducers<DataState>({
  user,
  tags
});

export default reducers;

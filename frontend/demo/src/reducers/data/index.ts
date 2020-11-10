import _, { combineReducers, Reducer } from "redux-starter-kit";
import { User } from "../../model/User";

import settings from "./settings";
import user from "./user";

export type DataState = {
  settings: any;
  user: User;
};

const reducers: Reducer = combineReducers<DataState>({
  settings,
  user
});

export default reducers;

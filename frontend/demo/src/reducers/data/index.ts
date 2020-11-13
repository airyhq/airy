import _, { combineReducers, Reducer } from "redux-starter-kit";
import { User } from "../../model/User";

import user from "./user";

export type DataState = {
  user: User;
};

const reducers: Reducer = combineReducers<DataState>({
  user
});

export default reducers;

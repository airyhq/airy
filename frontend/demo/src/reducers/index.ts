import { combineReducers } from "redux-starter-kit";
import { getType } from "typesafe-actions";
import _, { CombinedState } from "redux";

import * as authActions from "../actions/user";
import { clearUserData } from "../api/webStore";

import data, { DataState } from "./data";

export type StateModel = {
  data: DataState;
};

const applicationReducer = combineReducers<StateModel>({
  data
});

export type RootState = ReturnType<typeof applicationReducer>;

const rootReducer: (state: any, action: any) => CombinedState<StateModel> = (
  state,
  action
) => {
  if (action.type === getType(authActions.logoutUserAction)) {
    clearUserData();
    return applicationReducer(undefined, action);
  }
  return applicationReducer(state, action);
};

export default rootReducer;

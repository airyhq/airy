import _, {CombinedState, combineReducers} from 'redux';

import data, {DataState} from './data';
export * from './data';

export type StateModel = {
  data: DataState;
};

const applicationReducer = combineReducers<StateModel>({
  data,
});

const rootReducer: (state: any, action: any) => CombinedState<StateModel> = (state, action) => {
  /*
  TODO add back in https://github.com/airyhq/airy/issues/1519
  if (action.type === getType(authActions.logoutUserAction)) {
    clearUserData();
    return applicationReducer(undefined, action);
  }*/
  return applicationReducer(state, action);
};

export default rootReducer;

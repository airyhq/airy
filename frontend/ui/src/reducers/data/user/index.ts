import {User} from 'model';

export const initialState = {
  id: '123',
  firstName: 'Grace',
  lastName: 'Hopper',
};

const userReducer: any = (state = initialState): User | {} => {
  // TODO add back in https://github.com/airyhq/airy/issues/1519
  return state;
};

export default userReducer;

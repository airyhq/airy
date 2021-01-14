import {UserPayload} from '../payload/UserPayload';
import {User} from '../model';

export const userMapper = (payload: UserPayload): User => ({
  id: payload.id,
  firstName: payload.first_name,
  lastName: payload.last_name,
  displayName: payload.first_name + ' ' + payload.last_name,
  token: payload.token,
});

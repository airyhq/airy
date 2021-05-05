import {User} from './User';

export interface Config {
  components: {[key: string]: {enabled: boolean}};
  user_profile?: User;
}

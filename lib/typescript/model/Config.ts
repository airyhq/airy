import {User} from './User';

export interface Config {
  components: {[key: string]: {enabled: boolean}};
  userProfile?: User;
}

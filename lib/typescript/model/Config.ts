import {User} from './User';

export interface Config {
  components: {[key: string]: {enabled: boolean; healthy: boolean; component: string}};
  userProfile?: User;
}

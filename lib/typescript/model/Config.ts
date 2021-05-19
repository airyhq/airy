import {User} from './User';

export interface Config {
  services: {[key: string]: {enabled: boolean; healthy: boolean; component: string}};
  userProfile?: User;
}

export const getComponents = (config: Config) => {
  const {services} = config;
  return Object.keys(services).reduce((agg, key) => {
    const {healthy, enabled, component} = services[key];
    return {
      ...agg,
      [component]: {
        enabled,
        // A component is only healthy if all its services are healthy
        healthy: agg[component] ? agg[component].healthy && healthy : healthy,
      },
    };
  }, {});
};

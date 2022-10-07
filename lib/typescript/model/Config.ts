import {User} from './User';

export interface Config {
  services: {[key: string]: {enabled: boolean; healthy: boolean; component: string}};
  tagConfig?: {
    colors: {[id: string]: ColorSettings};
  };
  userProfile?: User;
  clusterVersion: string;
}

export interface ColorSettings {
  default: string;
  background: string;
  font: string;
  position: number;
  border: string;
}

export enum Language {
  german = 'German',
  english = 'English (US)',
  french = 'French',
  spanish = 'Spanish',
}

export const getComponents = (config: Config) => {
  const {services} = config;
  const servicesSorted = Object.fromEntries(
    Object.entries(services).sort((a, b) => a[1].component.localeCompare(b[1].component))
  );

  return Object.keys(servicesSorted).reduce((agg, key) => {
    const {healthy, enabled, component} = services[key];

    return {
      ...agg,
      [component]: {
        enabled,
        // A component is only healthy if all its services are healthy
        healthy: agg[component] ? agg[component].healthy && healthy : healthy,
        services: agg[component]
          ? [...agg[component].services, {name: key, healthy: healthy}]
          : [{name: key, healthy: healthy}],
      },
    };
  }, {});
};

export const getClusterVersion = (config: Config) => {
  return config.clusterVersion;
};

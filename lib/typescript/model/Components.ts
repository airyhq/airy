import {InstallationStatus} from './Connectors';
import {Source} from './Source';

export interface Components {
  components: {
    [key: string]: {
      [key: string]: string | boolean;
    };
  };
}

export interface ComponentInfo {
  displayName: string;
  name: string;
  availableFor: string;
  description: string;
  category: string;
  price: string;
  docs: string;
  source: Source;
  installationStatus: InstallationStatus;
  isChannel?: string;
  configurationValues?: string;
}

export enum ComponentStatus {
  enabled = 'Enabled',
  notConfigured = 'Not Configured',
  disabled = 'Disabled',
  notHealthy = 'Not Healthy',
}

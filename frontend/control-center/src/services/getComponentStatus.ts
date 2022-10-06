import {ComponentStatus} from 'model';

export const getComponentStatus = (
  isHealthy: boolean,
  isInstalled: boolean,
  isConfigured: boolean,
  isEnabled: boolean
) => {
  if (isInstalled && !isConfigured) return ComponentStatus.notConfigured;
  if (isInstalled && !isEnabled) return ComponentStatus.disabled;
  if (isInstalled && isConfigured && isEnabled && !isHealthy) return ComponentStatus.notHealthy;
  if (isInstalled && isConfigured && isEnabled) return ComponentStatus.enabled;
};

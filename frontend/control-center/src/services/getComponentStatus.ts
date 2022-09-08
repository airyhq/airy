import {ComponentStatus} from '../pages/Connectors';

export const getComponentStatus = (
  isHealthy: boolean,
  isInstalled: boolean,
  isConfigured: boolean,
  isEnabled: boolean
) => {
  if (isInstalled && !isEnabled) return ComponentStatus.disabled;
  if (isInstalled && !isConfigured) return ComponentStatus.notConfigured;
  if (!isHealthy) return ComponentStatus.notHealthy;
  if (isInstalled && isConfigured && isEnabled) return ComponentStatus.enabled;
};

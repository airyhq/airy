import {ComponentStatus} from '../pages/Connectors';

export const getComponentStatus = (
  isHealthy: boolean,
  isInstalled: boolean,
  isConfigured: boolean,
  isEnabled: boolean
) => {
  if (!isHealthy) return ComponentStatus.notHealthy;
  if (isInstalled && !isConfigured) return ComponentStatus.notConfigured;
  if (isInstalled && isConfigured && isEnabled) return ComponentStatus.enabled;
  if (isInstalled && !isEnabled) return ComponentStatus.disabled;
};

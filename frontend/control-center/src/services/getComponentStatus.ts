import {ComponentStatus} from '../pages/Connectors';

export const getComponentStatus = (isInstalled: boolean, isConfigured: boolean, isEnabled: boolean) => {
  if (isInstalled && !isConfigured) return ComponentStatus.notConfigured;
  if (isInstalled && isConfigured && isEnabled) return ComponentStatus.enabled;
  if (isInstalled && !isEnabled) return ComponentStatus.disabled;
};

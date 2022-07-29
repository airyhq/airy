import {ComponentStatus} from '../pages/Connectors';

export const getComponentStatus = (isConfigured: boolean, isEnabled: boolean) => {
  if (isConfigured && isEnabled) return ComponentStatus.enabled;
  if (!isConfigured && isEnabled) return ComponentStatus.notConfigured;
  if (!isEnabled) return ComponentStatus.disabled;
};

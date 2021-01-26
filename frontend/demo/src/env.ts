export interface Env {
  API_HOST?: string;
}

const templatedState: Env = (window as any).AIRY_TEMPLATED_STATE || {};

export const env: Env = {
  API_HOST: templatedState.API_HOST || 'api.airy',
};

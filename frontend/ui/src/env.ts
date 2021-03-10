export interface Env {
  API_HOST?: string;
  CHATPLUGIN_HOST?: string;
}

declare const window: {
  AIRY_TEMPLATED_STATE?: Env;
};

const templatedState: Env = window.AIRY_TEMPLATED_STATE || {};

export const env: Env = {
  API_HOST: templatedState.API_HOST || 'api.airy',
  CHATPLUGIN_HOST: templatedState.CHATPLUGIN_HOST || 'chatplugin.airy',
};

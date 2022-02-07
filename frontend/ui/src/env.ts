export interface Env {
  API_HOST?: string;
}

declare const window: {
  AIRY_TEMPLATED_STATE?: Env;
};

const templatedState: Env = window.AIRY_TEMPLATED_STATE || {};
export const env: Env = {
  API_HOST: templatedState.API_HOST || process?.env?.API_HOST,
};

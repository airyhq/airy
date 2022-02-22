import process from 'process';

export interface Env {
  API_HOST?: string;
  SYSTEM_TOKEN?: string;
}

declare const window: {
  AIRY_TEMPLATED_STATE?: Env;
};

const templatedState: Env = window.AIRY_TEMPLATED_STATE || {};
export const env: Env = {
  API_HOST: templatedState.API_HOST || process.env.API_HOST,
  SYSTEM_TOKEN: process.env.SYSTEM_TOKEN,
};

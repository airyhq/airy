import process from 'process';

export interface Env {
  API_HOST?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REDIRECT_URL?: string;
}

declare const window: {
  AIRY_TEMPLATED_STATE?: Env;
};

const templatedState: Env = window.AIRY_TEMPLATED_STATE || {};
export const env: Env = {
  API_HOST: templatedState.API_HOST || process.env.API_HOST || location.origin,
  GOOGLE_CLIENT_ID: '511393631708-a474325hqp9g19s08u1n7eskdlcdub30.apps.googleusercontent.com',
  GOOGLE_CLIENT_SECRET: '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',
  GOOGLE_REDIRECT_URL: 'http://localhost:8080/inbox',
};

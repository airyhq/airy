export interface Env {
  API_HOST?: string;
  APP_ID?: string;
}

declare global {
  interface Window {
    AIRY_TEMPLATED_STATE?: Env;
    FB?: {
      init: (params: FacebookLoginInitParams) => void;
      login: (loginRequest: (response) => void) => void;
      api: (url: string, apiRequest: (response) => void) => void;
    };
    fbAsyncInit?: () => void;
  }
}

const templatedState: Env = window.AIRY_TEMPLATED_STATE || {};

export const env: Env = {
  API_HOST: templatedState.API_HOST || process.env.API_HOST,
  APP_ID: '',
};

interface FacebookLoginInitParams {
  appId: string;
  cookie: boolean;
  xfbml: boolean;
  status: boolean;
  version: string;
}

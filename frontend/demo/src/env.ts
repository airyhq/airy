export interface Env {
  apiHost?: string;
}

export const env = (window as any).airy || {};

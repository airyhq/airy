export interface Env {
  API_HOST?: string;
}

export const env = (window as any).airy || {};

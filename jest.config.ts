import type {Config} from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
  '^.+\\.tsx?$': 'ts-jest',
  },
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/jest-config/fileMock.js",
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/lib/typescript/components/unit-testing'],
};
export default config;
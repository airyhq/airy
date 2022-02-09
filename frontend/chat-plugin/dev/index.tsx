import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import {render} from 'react-dom';
import {config} from './config';
import process from 'process';

declare global {
  interface Window {
    airy: {
      host: string;
      channelId: string;
    };
  }
}

const queryParams = new URLSearchParams(window.location.search);
const channelId = queryParams.get('channel_id');
const apiHost: string = window.airy
  ? window.airy.host
  : process.env.API_HOST ?? `${location.protocol + '//' + location.host}`;

console.log('AUDREY');

const renderMethod = async () => {
  const AiryChatPlugin = (await import('chat-plugin')).AiryChatPlugin;
  render(
    <AiryChatPlugin
      config={{
        channelId,
        apiHost,
        config,
      }}
    />,
    document.getElementById('root')
  );
};

renderMethod();

declare const module: any;

if (module.hot) {
  module.hot.accept('chat-plugin', () => {
    renderMethod();
  });
}

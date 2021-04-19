import React from 'react';
import {render} from 'react-dom';
import Chat from './components/chat';
import {AiryChatPluginConfiguration} from './config';

export default class {
  config: AiryChatPluginConfiguration;

  constructor(config: AiryChatPluginConfiguration) {
    this.config = config;
  }

  render(target: HTMLElement) {
    render(<Chat {...this.config} />, target);
  }
}

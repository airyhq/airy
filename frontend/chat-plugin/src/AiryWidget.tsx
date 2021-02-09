import React from 'react';
import {render} from 'react-dom';
import Chat from './components/chat';
import {AiryWidgetConfiguration} from './config';

export default class {
  config: AiryWidgetConfiguration;

  constructor(config: AiryWidgetConfiguration) {
    this.config = config;
  }

  render(target: HTMLElement) {
    render(<Chat {...this.config} />, target);
  }
}

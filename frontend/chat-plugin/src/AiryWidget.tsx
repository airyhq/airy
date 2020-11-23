import {h, render} from 'preact';
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

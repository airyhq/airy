import {useEffect} from 'react';
import AiryWidget from './AiryWidget';
import {AiryWidgetConfiguration} from './config';

type AiryWidgetWrapperProps = AiryWidgetConfiguration & {
  chatPluginParentDiv: string;
};

export function AiryWidgetWrapper(config: AiryWidgetWrapperProps) {
  const chatPluginParentDiv = document.querySelector(config.chatPluginParentDiv);
  const chatPluginDiv = document.querySelector('#chatplugin');

  const anchor = document.createElement('div');
  anchor.setAttribute('id', 'chatplugin');
  anchor.style.cssText = `
  position: fixed;
  width: -webkit-fill-available;
  width: -moz-available;
  right: 0;
  bottom: 0;
  z-index: 9999;
  height: 100vh;
  max-height: 700px;
  max-width: 380px;
  padding: 0;
  margin: 0;
  color: #444;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  `;

  useEffect(() => {
    if (chatPluginParentDiv) {
      if (chatPluginDiv) {
        chatPluginDiv.remove();
      }

      new AiryWidget({...config}).render(anchor);
      chatPluginParentDiv.appendChild(anchor);
    }
  }, [config]);

  return null;
}

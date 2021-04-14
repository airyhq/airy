import {useEffect} from 'react';
import AiryWidget from './AiryWidget';
import {AiryWidgetConfiguration} from './config';

type AiryWidgetWrapperProps = AiryWidgetConfiguration & {
  domNode: string;
};

export function AiryWidgetWrapper(config: AiryWidgetWrapperProps) {
  const chatPluginDiv = document.querySelector(config.domNode);
  const chatStyle = `
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
  const anchor = document.createElement('div');
  anchor.setAttribute('id', 'demo');
  anchor.style.cssText = chatStyle;

  const updatedAnchor = document.createElement('div');
  updatedAnchor.setAttribute('id', 'demo');
  updatedAnchor.style.cssText = chatStyle;

  const chatDiv = document.querySelector('#demo');

  useEffect(() => {
    if (chatDiv && chatPluginDiv !== null) {
      new AiryWidget({...config}).render(updatedAnchor);
      chatDiv.remove();
      chatPluginDiv.appendChild(updatedAnchor);
    } else if (chatPluginDiv !== null) {
      new AiryWidget({...config}).render(anchor);
      chatPluginDiv.appendChild(anchor);
    }
  }, [config]);

  return null;
}

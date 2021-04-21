import React, {useEffect, createRef, CSSProperties} from 'react';
import {AiryChatPluginConfiguration} from './config';
import AiryWidget from './AiryWidget';

import styles from './AiryChatPlugin.module.scss';

type AiryChatPluginProps = {
  config: AiryChatPluginConfiguration;
  customCSS?: CSSProperties;
};

export const AiryChatPlugin = (props: AiryChatPluginProps) => {
  const {config, customCSS} = props;

  const chatPlugin: AiryWidget = new AiryWidget({...config});
  const anchorRef: React.RefObject<HTMLInputElement> = createRef();

  useEffect(() => {
    chatPlugin.config = config;
    const chatpluginContainer = document.getElementById('chatpluginContainerId');
    chatPlugin.render(anchorRef.current);
    chatpluginContainer.appendChild(anchorRef.current);
  }, [config]);

  const customStyle = {
    background: 'transparent',
    ...(config.config?.primaryColor && {
      '--color-airy-blue': config.config?.primaryColor,
    }),
    ...(config.config?.accentColor && {
      '--color-airy-accent': config.config?.accentColor,
      '--color-airy-blue-hover': config.config?.accentColor,
      '--color-airy-blue-pressed': config.config?.accentColor,
    }),
  };

  return (
    <div id="chatpluginContainerId" className={`${customCSS || styles.chatpluginWrapper}`}>
      <div style={customStyle} ref={anchorRef} />
    </div>
  );
};

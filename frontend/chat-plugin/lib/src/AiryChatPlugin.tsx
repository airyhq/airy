import React, {useState} from 'react';
import {AiryChatPluginConfiguration} from './config';

import Chat from './components/chat';

type AiryChatPluginProps = {
  config: AiryChatPluginConfiguration;
  className?: string;
};

export const AiryChatPlugin = (props: AiryChatPluginProps) => {
  const {config, className} = props;

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  const widgetHeight = (): number => {
    if (config.config?.height) {
      return config.config.height > windowHeight ? windowHeight : config.config.height;
    }
    return 700 > windowHeight ? windowHeight : 700;
  };

  const widgetWidth = (): number => {
    if (config.config?.width) {
      return config.config.width > windowWidth ? windowWidth : config.config.width;
    }
    return 380 > windowWidth ? windowWidth : 380;
  };

  const customStyle = {
    background: 'transparent',
    height: widgetHeight(),
    width: widgetWidth(),
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
    <div className={className} style={customStyle}>
      <Chat {...config} />
    </div>
  );
};

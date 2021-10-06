import React, {useState} from 'react';
import {AiryChatPluginConfiguration} from './config';
import '../../translations';

import Chat from './components/chat';

type AiryChatPluginProps = {
  config: AiryChatPluginConfiguration;
  className?: string;
};

const defaultWidth = 380;
const defaultHeight = 700;

export const AiryChatPlugin = (props: AiryChatPluginProps) => {
  const {config, className} = props;

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  const customStyle = {
    background: 'transparent',
    width: Math.min(config.config?.width ?? defaultWidth, windowWidth),
    height: Math.min(config.config?.height ?? defaultHeight, windowHeight),
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

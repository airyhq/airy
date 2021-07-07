import React from 'react';
import {AiryChatPluginConfiguration} from './config';

import Chat from './components/chat';

type AiryChatPluginProps = {
  config: AiryChatPluginConfiguration;
  className?: string;
};

export const AiryChatPlugin = (props: AiryChatPluginProps) => {
  const {config, className} = props;

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
    <div className={className} style={customStyle}>
      <Chat {...config} />
    </div>
  );
};

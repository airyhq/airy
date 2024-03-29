import React, {useState} from 'react';
import {AiryChatPluginConfiguration} from './config';
import 'translations';

import Chat from './components/chat';

type AiryChatPluginProps = {
  config: AiryChatPluginConfiguration;
  className?: string;
  bubbleState?: 'expanded' | 'minimized';
};

const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 700;

export const AiryChatPlugin = (props: AiryChatPluginProps) => {
  const {config, className} = props;

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
  };

  window.addEventListener('resize', handleResize);

  if (
    props.bubbleState === 'minimized'
      ? (config.config.bubbleState = 'minimized')
      : (config.config.bubbleState = 'expanded')
  )
    if (
      (config.config?.useCustomFont === undefined || config.config?.useCustomFont) &&
      config.config.customFont !== 'Arial'
    ) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute(
        'href',
        `https://fonts.googleapis.com/css?family=${config.config?.customFont || 'Lato'}:300,400,700,900`
      );
      document.getElementsByTagName('head')[0].appendChild(link);
    }

  const chatpluginStyle = {
    background: 'transparent',
    width: windowWidth < 420 ? windowWidth : Math.min((config.config?.width as number) ?? DEFAULT_WIDTH, windowWidth),
    height:
      windowHeight < 700 ? windowHeight : Math.min((config.config?.height as number) ?? DEFAULT_HEIGHT, windowHeight),
    ...customStyle(config),
  };

  if (config.apiHost === '') {
    config.apiHost = window.origin;
  }

  return (
    <div className={className} style={chatpluginStyle}>
      <Chat {...config} />
    </div>
  );
};

const customStyle = (config: AiryChatPluginConfiguration) => {
  return {
    ...(config.config?.headerTextColor && {
      '--color-text-contrast': config.config?.headerTextColor,
    }),
    ...(config.config?.subtitleTextColor && {
      '--color-text-contrast': config.config?.subtitleTextColor,
    }),
    ...(config.config?.primaryColor && {
      '--color-airy-blue': config.config?.primaryColor,
      '--color-airy-message-outbound': config.config?.primaryColor,
    }),
    ...(config.config?.accentColor && {
      '--color-airy-accent': config.config?.accentColor,
      '--color-airy-blue-hover': config.config?.accentColor,
      '--color-airy-blue-pressed': config.config?.accentColor,
    }),
    ...(config.config?.outboundMessageColor && {
      '--color-airy-message-outbound': config.config?.outboundMessageColor,
    }),
    ...(config.config?.inboundMessageColor && {
      '--color-airy-message-inbound': config.config?.inboundMessageColor,
    }),
    ...(config.config?.outboundMessageTextColor && {
      '--color-airy-message-text-outbound': config.config?.outboundMessageTextColor,
    }),
    ...(config.config?.inboundMessageTextColor && {
      '--color-airy-message-text-inbound': config.config?.inboundMessageTextColor,
    }),
    ...(config.config?.unreadMessageDotColor && {
      '--color-red-alert': config.config?.unreadMessageDotColor,
    }),
    ...(config.config?.customFont && {
      '--font': config.config?.customFont,
    }),
  };
};

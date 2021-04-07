import React, {Component} from 'react';
import Chat from './components/chat';
import style from './App.module.scss';

export default class App extends Component {
  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const channelId = queryParams.get('channel_id');

    const customStyle = {
      background: 'transparent',
      ...(config?.primaryColor && {
        '--color-airy-blue': config?.primaryColor,
      }),
      ...(config?.accentColor && {
        '--color-airy-accent': config?.accentColor,
        '--color-airy-blue-hover': config?.accentColor,
        '--color-airy-blue-pressed': config?.accentColor,
      }),
    };

    return (
      <div className={style.container} style={customStyle}>
        {channelId ? (
          <Chat channelId={channelId} config={config} />
        ) : (
          <span style={{color: 'red'}}>Widget authorization failed. Please check your installation.</span>
        )}
      </div>
    );
  }
}

export type Config = {
  welcomeMessage?: {};
  headerText?: string;
  headerTextColor?: string;
  backgroundColor?: string;
  primaryColor?: string;
  accentColor?: string;
  bubbleIcon?: string;
  sendMessageIcon?: string;
};

export const config: Config = {
  welcomeMessage: {
    fallback: 'Hello!\n\nWelcome to Airy!',
    richCard: {
      standaloneCard: {
        cardContent: {
          title: 'Hola!',
          description: 'Welcome to Airy!',
          media: {
            height: 'MEDIUM',
            contentInfo: {
              altText: 'Airy logo',
              fileUrl: 'https://picsum.photos/200',
              forceRefresh: 'false',
            },
          },
          suggestions: [
            {
              reply: {
                text: "Let's start",
                postbackData: '/start',
              },
            },
          ],
        },
      },
    },
  },
};

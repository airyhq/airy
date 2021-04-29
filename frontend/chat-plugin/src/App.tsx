import React, {Component} from 'react';
import Chat from './components/chat';
import style from './App.module.scss';
import {Config} from './config';

declare global {
  interface Window {
    airy: {
      host: string;
      channelId: string;
    };
  }
}

export default class App extends Component {
  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const channelId = queryParams.get('channel_id');

    const apiHost: string = window.airy ? window.airy.host : process.env.API_HOST;

    return (
      <div className={style.container}>
        {channelId ? (
          <Chat
            channelId={channelId}
            apiHost={apiHost}
            config={{
              ...config,
            }}
          />
        ) : (
          <span style={{color: 'red'}}>Widget authorization failed. Please check your installation.</span>
        )}
      </div>
    );
  }
}

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
  showMode: false,
};

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
  headerTextColor: '#FFFFFF',
  primaryColor: '#DF3817',
  accentColor: '#DF3817',
  backgroundColor: '#393536',
  showMode: false,
  headerText: 'Test',
  welcomeMessage: {
    fallback: 'Welcome to Just the Tonic! How can we help you today?',
    richCard: {
      standaloneCard: {
        cardContent: {
          media: {
            height: 'MEDIUM',
            contentInfo: {
              altText: 'Welcome to Just the Tonic! How can we help you today?',
              fileUrl: 'https://airy-platform-media.s3.amazonaws.com/a09eb5ad-937d-4923-8e2e-74649ac1b12a',
            },
          },
          title: 'Welcome to Just the Tonic! How can we help you today?',
          description: 'I have a question about:',
          suggestions: [
            {
              reply: {
                text: 'Corona',
                postbackData: 'JTT-LC-covidupdate',
              },
            },
            {
              reply: {
                text: 'A Livestreamed Event',
                postbackData: 'JTT-LC-livestreamed-event',
              },
            },
            {
              reply: {
                text: 'A Club Event',
                postbackData: 'JTT-LC-club-event',
              },
            },
            {
              reply: {
                text: 'Discounts, Offers & News',
                postbackData: 'JTT-LC-news',
              },
            },
          ],
        },
      },
    },
  },
};

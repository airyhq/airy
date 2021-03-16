import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {ChannelSource, Channel, Config} from 'httpclient';
import {SmsWhatsappDialogue} from '../Providers/Twilio/RequirementsDialog';
import {RequirementsDialog} from '../Providers/Facebook/Messenger/RequirementsDialog';
import ChatPluginSource from '../Providers/Airy/ChatPlugin/ChatPluginSource';
import FacebookSource from '../Providers/Facebook/Messenger/FacebookSource';
import TwilioSmsSource from '../Providers/Twilio/TwilioSmsSource';
import TwilioWhatsAppSource from '../Providers/Twilio/TwilioWhatsAppSource';
import GoogleSource from '../Providers/Google/GoogleSource';

import styles from './index.module.scss';

import {
  CHANNELS_FACEBOOK_ROUTE,
  CHANNELS_TWILIO_SMS_ROUTE,
  CHANNELS_TWILIO_WHATSAPP_ROUTE,
} from '../../../routes/routes';

type MainPageProps = {
  channels: Channel[];
  config: Config;
};

const MainPage = (props: MainPageProps & RouteComponentProps) => {
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');

  const OpenRequirementsDialog = ({source}: {source: string}): JSX.Element => {
    switch (source) {
      case ChannelSource.facebook:
        return (
          <RequirementsDialog
            onClose={() => setDisplayDialogFromSource('')}
            onAddChannel={() => props.history.push(CHANNELS_FACEBOOK_ROUTE)}
          />
        );
      case ChannelSource.google:
        break;
      case ChannelSource.chatPlugin:
        break;
      case ChannelSource.twilioSMS:
        return (
          <SmsWhatsappDialogue
            onClose={() => setDisplayDialogFromSource('')}
            onAddChannel={() => props.history.push(CHANNELS_TWILIO_SMS_ROUTE + '/new_account')}
          />
        );
      case ChannelSource.twilioWhatsapp:
        return (
          <SmsWhatsappDialogue
            onClose={() => setDisplayDialogFromSource('')}
            onAddChannel={() => props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account')}
          />
        );
    }
  };

  return (
    <>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Channels</h1>
        </div>
      </div>
      <div className={styles.channelsChoice}>
        {' '}
        <p>Choose a channel you want to connect</p>
      </div>

      <div className={styles.wrapper}>
        {displayDialogFromSource !== '' && <OpenRequirementsDialog source={displayDialogFromSource} />}
        {props.config.components['sources-chatplugin'].enabled && <ChatPluginSource pluginSource={props.channels} />}
        {props.config.components['sources-facebook'].enabled && (
          <FacebookSource
            facebookSource={props.channels}
            showDialogAction={(source: string) => setDisplayDialogFromSource(source)}
          />
        )}
        {props.config.components['sources-twilio'].enabled && (
          <TwilioSmsSource
            twilioSmsSource={props.channels}
            showDialogAction={(source: string) => setDisplayDialogFromSource(source)}
          />
        )}
        {props.config.components['sources-twilio'].enabled && (
          <TwilioWhatsAppSource
            whatsappSmsSource={props.channels}
            showDialogAction={(source: string) => setDisplayDialogFromSource(source)}
          />
        )}
        {props.config.components['sources-google'].enabled && <GoogleSource googleSource={props.channels} />}
      </div>
    </>
  );
};

export default withRouter(MainPage);

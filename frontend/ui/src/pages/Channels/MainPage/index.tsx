import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {SourceType, Channel, Config} from 'httpclient';
import {FacebookMessengerRequirementsDialog} from '../Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {TwilioRequirementsDialog} from '../Providers/Twilio/TwilioRequirementsDialog';
import ChatPluginSource from '../Providers/Airy/ChatPlugin/ChatPluginSource';
import FacebookSource from '../Providers/Facebook/Messenger/FacebookSource';
import GoogleSource from '../Providers/Google/BusinessMessages/GoogleSource';
import TwilioSmsSource from '../Providers/Twilio/SMS/TwilioSmsSource';
import TwilioWhatsAppSource from '../Providers/Twilio/WhatsApp/TwilioWhatsAppSource';

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
      case SourceType.facebook:
        return <FacebookMessengerRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case SourceType.google:
        break;
      case SourceType.chatPlugin:
        break;
      case SourceType.twilioSMS:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case SourceType.twilioWhatsapp:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
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
        <ChatPluginSource pluginSource={props.channels} />
        <FacebookSource
          facebookSource={props.channels}
          addChannelAction={(source: string) => {
            if (props.config.components['sources-facebook'].enabled) {
              props.history.push(CHANNELS_FACEBOOK_ROUTE);
            } else {
              setDisplayDialogFromSource(source);
            }
          }}
        />
        <TwilioSmsSource
          twilioSmsSource={props.channels}
          addChannelAction={(source: string) => {
            if (props.config.components['sources-twilio'].enabled) {
              props.history.push(CHANNELS_TWILIO_SMS_ROUTE + '/new_account');
            } else {
              setDisplayDialogFromSource(source);
            }
          }}
        />
        <TwilioWhatsAppSource
          whatsappSmsSource={props.channels}
          addChannelAction={(source: string) => {
            if (props.config.components['sources-twilio'].enabled) {
              props.history.push(CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account');
            } else {
              setDisplayDialogFromSource(source);
            }
          }}
        />
        <GoogleSource googleSource={props.channels} />
      </div>
    </>
  );
};

export default withRouter(MainPage);

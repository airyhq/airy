import React from 'react';

import ChatPluginSource from './Sources/ChatPluginSource';
import FacebookSource from './Sources/FacebookSource';
import TwilioSmsSource from './Sources/TwilioSmsSource';
import GoogleSource from './Sources/GoogleSource';
import TwilioWhatsAppSource from './Sources/TwilioWhatsAppSource';

import {Channel, ConfigPayload} from 'httpclient';

import styles from './index.module.scss';

type ChannelsConnectProps = {
  channels: Channel[];
  config: ConfigPayload;
};

const ChannelsMainPage = (props: ChannelsConnectProps) => {
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
        {props.config.components['sources-chatplugin'].enabled && <ChatPluginSource pluginSource={props.channels} />}
        {props.config.components['sources-facebook'].enabled && <FacebookSource facebookSource={props.channels} />}
        {props.config.components['sources-twilio'].enabled && <TwilioSmsSource twilloSmsSource={props.channels} />}
        {props.config.components['sources-twilio'].enabled && (
          <TwilioWhatsAppSource whatsappSmsSource={props.channels} />
        )}
        {props.config.components['sources-google'].enabled && <GoogleSource googleSource={props.channels} />}
      </div>
    </>
  );
};

export default ChannelsMainPage;

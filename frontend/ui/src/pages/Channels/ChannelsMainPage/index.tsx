import React from 'react';

import ChatPluginSource from './Sources/ChatPluginSource';
import FacebookSource from './Sources/FacebookSource';
import TwilioSmsSource from './Sources/TwilioSmsSource';
import GoogleSource from './Sources/GoogleSource';
import TwilioWhatsAppSource from './Sources/TwilioWhatsAppSource';

import {Channel} from 'httpclient';

import styles from './index.module.scss';

type ChannelsConnectProps = {
  channels: Channel[];
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
        <ChatPluginSource pluginSource={props.channels} />
        <FacebookSource facebookSource={props.channels} />
        <TwilioSmsSource twilloSmsSource={props.channels} />
        <TwilioWhatsAppSource whatsappSmsSource={props.channels} />
        <GoogleSource googleSource={props.channels} />
      </div>
    </>
  );
};

export default ChannelsMainPage;

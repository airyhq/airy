import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Source, Channel, Config} from 'httpclient';
import {FacebookMessengerRequirementsDialog} from '../Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {TwilioRequirementsDialog} from '../Providers/Twilio/TwilioRequirementsDialog';
import SourceDescriptionCard from '../SourceDescriptionCard';
import ConnectedChannelsBySourceCard from '../ConnectedChannelsBySourceCard';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsappLogo} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/google_avatar.svg';

import styles from './index.module.scss';

import {
  CHANNELS_FACEBOOK_ROUTE,
  CHANNELS_TWILIO_SMS_ROUTE,
  CHANNELS_TWILIO_WHATSAPP_ROUTE,
  CHANNELS_CONNECTED_ROUTE,
  CHANNELS_CHAT_PLUGIN_ROUTE,
} from '../../../routes/routes';

type MainPageProps = {
  channels: Channel[];
  config: Config;
};

export type SourceInfo = {
  type: Source;
  title: string;
  description: string;
  image: JSX.Element;
  newChannelRoute: string;
  channelsListRoute: string;
  configKey: string;
  channelsToShow: number;
  itemInfoString: string;
};

const SourcesInfo: SourceInfo[] = [
  {
    type: Source.chatPlugin,
    title: 'Airy Live Chat',
    description: 'Best of class browser messenger',
    image: <AiryAvatarIcon />,
    newChannelRoute: CHANNELS_CHAT_PLUGIN_ROUTE + '/new',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/chatplugin',
    configKey: 'sources-chatplugin',
    channelsToShow: 4,
    itemInfoString: 'channels',
  },
  {
    type: Source.facebook,
    title: 'Messenger',
    description: 'Connect multiple Facebook pages',
    image: <MessengerAvatarIcon />,
    newChannelRoute: CHANNELS_FACEBOOK_ROUTE,
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/facebook',
    configKey: 'sources-facebook',
    channelsToShow: 4,
    itemInfoString: 'channels',
  },
  {
    type: Source.twilioSMS,
    title: 'SMS',
    description: 'Deliver SMS with ease',
    image: <SMSAvatarIcon />,
    newChannelRoute: CHANNELS_TWILIO_SMS_ROUTE + '/new_account',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/twilio.sms/#',
    configKey: 'sources-twilio',
    channelsToShow: 2,
    itemInfoString: 'phones',
  },
  {
    type: Source.twilioWhatsapp,
    title: 'Whatsapp',
    description: 'World #1 chat app',
    image: <WhatsappLogo />,
    newChannelRoute: CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
    configKey: 'sources-twilio',
    channelsToShow: 2,
    itemInfoString: 'phones',
  },
  {
    type: Source.google,
    title: 'Google Business Messages',
    description: 'Be there when people search',
    image: <GoogleAvatarIcon />,
    newChannelRoute: '/',
    channelsListRoute: '/',
    configKey: 'sources-google',
    channelsToShow: 4,
    itemInfoString: 'channels',
  },
];

const MainPage = (props: MainPageProps & RouteComponentProps) => {
  const {channels, config} = props;
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');

  const OpenRequirementsDialog = ({source}: {source: string}): JSX.Element => {
    switch (source) {
      case Source.facebook:
        return <FacebookMessengerRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.google:
        return <FacebookMessengerRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
        break;
      case Source.chatPlugin:
        break;
      case Source.twilioSMS:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.twilioWhatsapp:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
    }
  };

  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);

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
        {SourcesInfo.map((infoItem: SourceInfo) => (
          <div style={{display: 'flex', flexGrow: 1}} key={infoItem.type}>
            <SourceDescriptionCard
              SourceInfo={infoItem}
              displayButton={!channelsBySource(infoItem.type).length}
              addChannelAction={() => {
                if (config.components[infoItem.configKey].enabled) {
                  props.history.push(infoItem.newChannelRoute);
                } else {
                  setDisplayDialogFromSource(infoItem.type);
                }
              }}
            />
            <ConnectedChannelsBySourceCard
              SourceInfo={infoItem}
              channels={channelsBySource(infoItem.type)}
              connected="CONNECTED"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default withRouter(MainPage);

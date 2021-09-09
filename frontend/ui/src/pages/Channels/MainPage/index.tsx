import React, {useState} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';

import {Source, Channel, Config} from 'model';
import {FacebookMessengerRequirementsDialog} from '../Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {InstagramRequirementsDialog} from '../Providers/Instagram/InstagramRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Providers/Twilio/TwilioRequirementsDialog';
import SourceDescriptionCard from '../SourceDescriptionCard';
import ConnectedChannelsBySourceCard from '../ConnectedChannelsBySourceCard';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airy_avatar.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/messenger_avatar.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/sms_avatar.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsapp_avatar.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/google_avatar.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagram_avatar.svg';

import styles from './index.module.scss';
import {
  cyChannelsChatPluginAddButton,
  cyChannelsChatPluginList,
  cyChannelsFacebookAddButton,
  cyChannelsFacebookList,
  cyChannelsGoogleAddButton,
  cyChannelsGoogleList,
  cyChannelsTwilioSmsAddButton,
  cyChannelsTwilioSmsList,
  cyChannelsTwilioWhatsappAddButton,
  cyChannelsTwilioWhatsappList,
  cyChannelsInstagramAddButton,
  cyChannelsInstagramList,
} from 'handles';
import {
  CHANNELS_FACEBOOK_ROUTE,
  CHANNELS_TWILIO_SMS_ROUTE,
  CHANNELS_TWILIO_WHATSAPP_ROUTE,
  CHANNELS_CONNECTED_ROUTE,
  CHANNELS_CHAT_PLUGIN_ROUTE,
  CHANNELS_GOOGLE_ROUTE,
  CHANNELS_INSTAGRAM_ROUTE,
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
  dataCyAddChannelButton: string;
  dataCyChannelList: string;
};

const SourcesInfo: SourceInfo[] = [
  {
    type: Source.chatPlugin,
    title: 'Airy Live Chat',
    description: 'Best of class browser messenger',
    image: <AiryAvatarIcon />,
    newChannelRoute: CHANNELS_CHAT_PLUGIN_ROUTE + '/new',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/chatplugin',
    configKey: 'sources-chat-plugin',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsChatPluginAddButton,
    dataCyChannelList: cyChannelsChatPluginList,
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
    dataCyAddChannelButton: cyChannelsFacebookAddButton,
    dataCyChannelList: cyChannelsFacebookList,
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
    dataCyAddChannelButton: cyChannelsTwilioSmsAddButton,
    dataCyChannelList: cyChannelsTwilioSmsList,
  },
  {
    type: Source.twilioWhatsApp,
    title: 'WhatsApp',
    description: 'World #1 chat app',
    image: <WhatsAppAvatarIcon />,
    newChannelRoute: CHANNELS_TWILIO_WHATSAPP_ROUTE + '/new_account',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
    configKey: 'sources-twilio',
    channelsToShow: 2,
    itemInfoString: 'phones',
    dataCyAddChannelButton: cyChannelsTwilioWhatsappAddButton,
    dataCyChannelList: cyChannelsTwilioWhatsappList,
  },
  {
    type: Source.google,
    title: 'Google Business Messages',
    description: 'Be there when people search',
    image: <GoogleAvatarIcon />,
    newChannelRoute: CHANNELS_GOOGLE_ROUTE + '/new_account',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/google',
    configKey: 'sources-google',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsGoogleAddButton,
    dataCyChannelList: cyChannelsGoogleList,
  },
  {
    type: Source.instagram,
    title: 'Instagram',
    description: 'Connect multiple Instagram pages',
    image: <InstagramIcon />,
    newChannelRoute: CHANNELS_INSTAGRAM_ROUTE,
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/instagram',
    configKey: 'sources-facebook',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsInstagramAddButton,
    dataCyChannelList: cyChannelsInstagramList,
  },
];

const MainPage = (props: MainPageProps & RouteComponentProps) => {
  const {channels, config} = props;

  console.log('config', config);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');

  const OpenRequirementsDialog = ({source}: {source: string}): JSX.Element => {
    switch (source) {
      case Source.facebook:
        return <FacebookMessengerRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.google:
        return <GoogleBusinessMessagesRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.twilioSMS:
      case Source.twilioWhatsApp:
        return <TwilioRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
      case Source.instagram:
        return <InstagramRequirementsDialog onClose={() => setDisplayDialogFromSource('')} />;
    }

    return null;
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
              sourceInfo={infoItem}
              displayButton={!channelsBySource(infoItem.type).length}
              addChannelAction={() => {
                if (config.components[infoItem.configKey] && config.components[infoItem.configKey].enabled) {
                  props.history.push(infoItem.newChannelRoute);
                } else {
                  setDisplayDialogFromSource(infoItem.type);
                }
              }}
            />
            <ConnectedChannelsBySourceCard sourceInfo={infoItem} channels={channelsBySource(infoItem.type)} />
          </div>
        ))}
      </div>
    </>
  );
};

export default withRouter(MainPage);

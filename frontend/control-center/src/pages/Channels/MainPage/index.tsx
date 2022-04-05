import React, {useEffect, useState} from 'react';

import {Channel, Source} from 'model';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyLogo.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/facebookMessengerLogoBlue.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/phoneIcon.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsappLogoFilled.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/googleLogo.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramLogoFilled.svg';

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
} from '../../routes/routes';
import {StateModel} from '../../reducers';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {allChannelsConnected} from '../../selectors/channels';
import ChannelCard from '../Channels/ChannelCard';
import {FacebookMessengerRequirementsDialog} from '../Channels/Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Channels/Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Channels/Providers/Twilio/TwilioRequirementsDialog';
import {InstagramRequirementsDialog} from '../Channels/Providers/Instagram/InstagramRequirementsDialog';
import {setPageTitle} from '../../services/pageTitle';

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
    newChannelRoute: CHANNELS_FACEBOOK_ROUTE + '/new',
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
    newChannelRoute: CHANNELS_INSTAGRAM_ROUTE + '/new',
    channelsListRoute: CHANNELS_CONNECTED_ROUTE + '/instagram',
    configKey: 'sources-facebook',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsInstagramAddButton,
    dataCyChannelList: cyChannelsInstagramList,
  },
];

const Catalog = () => {
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const config = useSelector((state: StateModel) => state.data.config);
  const [displayDialogFromSource, setDisplayDialogFromSource] = useState('');

  useEffect(() => {
    setPageTitle('Catalog');
  }, []);

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
  const navigate = useNavigate();

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.catalogHeadline}>
        <div>
          <h1 className={styles.catalogHeadlineText}>Catalog</h1>
        </div>
      </div>

      <div className={styles.wrapper}>
        {displayDialogFromSource !== '' && <OpenRequirementsDialog source={displayDialogFromSource} />}
        {SourcesInfo.map((infoItem: SourceInfo) => {
          return (
            channelsBySource(infoItem.type).length === 0 && (
              <div style={{display: 'flex'}} key={infoItem.type}>
                <ChannelCard
                  sourceInfo={infoItem}
                  addChannelAction={() => {
                    if (config.components[infoItem.configKey] && config.components[infoItem.configKey].enabled) {
                      navigate(infoItem.newChannelRoute);
                    } else {
                      setDisplayDialogFromSource(infoItem.type);
                    }
                  }}
                />
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Catalog;

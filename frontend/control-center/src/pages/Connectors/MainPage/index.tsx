import React, {useState} from 'react';

import {Channel, Source} from 'model';
import {FacebookMessengerRequirementsDialog} from '../Providers/Facebook/Messenger/FacebookMessengerRequirementsDialog';
import {InstagramRequirementsDialog} from '../Providers/Instagram/InstagramRequirementsDialog';
import {GoogleBusinessMessagesRequirementsDialog} from '../Providers/Google/GoogleBusinessMessagesRequirementsDialog';
import {TwilioRequirementsDialog} from '../Providers/Twilio/TwilioRequirementsDialog';
import ConnectorCard from '../ConnectorCard';

import {ReactComponent as AiryAvatarIcon} from 'assets/images/icons/airyCCLogo.svg';
import {ReactComponent as MessengerAvatarIcon} from 'assets/images/icons/facebookMessengerCCLogo.svg';
import {ReactComponent as SMSAvatarIcon} from 'assets/images/icons/twilioSmsCCLogo.svg';
import {ReactComponent as WhatsAppAvatarIcon} from 'assets/images/icons/whatsappCCLogo.svg';
import {ReactComponent as GoogleAvatarIcon} from 'assets/images/icons/googleCCLogo.svg';
import {ReactComponent as InstagramIcon} from 'assets/images/icons/instagramCCLogo.svg';

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
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CONNECTED_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
} from '../../../routes/routes';
import {StateModel} from '../../../reducers';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {allChannelsConnected} from '../../../selectors/channels';

export type SourceInfo = {
  type: Source;
  title: string;
  description: string;
  image: JSX.Element;
  newConnectorRoute: string;
  connectorsListRoute: string;
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
    newConnectorRoute: CONNECTORS_CHAT_PLUGIN_ROUTE + '/new',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/chatplugin',
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
    newConnectorRoute: CONNECTORS_FACEBOOK_ROUTE + '/new',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/facebook',
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
    newConnectorRoute: CONNECTORS_TWILIO_SMS_ROUTE + '/new_account',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.sms/#',
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
    newConnectorRoute: CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new_account',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
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
    newConnectorRoute: CONNECTORS_GOOGLE_ROUTE + '/new_account',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/google',
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
    newConnectorRoute: CONNECTORS_INSTAGRAM_ROUTE + '/new',
    connectorsListRoute: CONNECTORS_CONNECTED_ROUTE + '/instagram',
    configKey: 'sources-facebook',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsInstagramAddButton,
    dataCyChannelList: cyChannelsInstagramList,
  },
];

const MainPage = () => {
  const connectors = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const config = useSelector((state: StateModel) => state.data.config);
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

  const channelsBySource = (Source: Source) => connectors.filter((channel: Channel) => channel.source === Source);
  const navigate = useNavigate();

  return (
    <div className={styles.connectorsWrapper}>
      <div className={styles.connectorsHeadline}>
        <div>
          <h1 className={styles.connectorsHeadlineText}>Connectors</h1>
        </div>
      </div>

      <div className={styles.wrapper}>
        {displayDialogFromSource !== '' && <OpenRequirementsDialog source={displayDialogFromSource} />}
        {SourcesInfo.map((infoItem: SourceInfo) => (
          <div style={{display: 'flex'}} key={infoItem.type}>
            <ConnectorCard
              sourceInfo={infoItem}
              addConnectorAction={() => {
                if (channelsBySource(infoItem.type).length > 0) {
                  return navigate(infoItem.connectorsListRoute);
                }
                if (config.components[infoItem.configKey] && config.components[infoItem.configKey].enabled) {
                  navigate(infoItem.newConnectorRoute);
                } else {
                  setDisplayDialogFromSource(infoItem.type);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;

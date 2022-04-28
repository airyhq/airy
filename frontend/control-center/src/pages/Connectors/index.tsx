import React, {useEffect} from 'react';

import {Channel, Source} from 'model';
import ChannelCard from './ChannelCard';

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
  CONNECTORS_FACEBOOK_ROUTE,
  CONNECTORS_TWILIO_SMS_ROUTE,
  CONNECTORS_TWILIO_WHATSAPP_ROUTE,
  CONNECTORS_CONNECTED_ROUTE,
  CONNECTORS_CHAT_PLUGIN_ROUTE,
  CONNECTORS_GOOGLE_ROUTE,
  CONNECTORS_INSTAGRAM_ROUTE,
} from '../../routes/routes';
import {StateModel} from '../../reducers';
import {connect, ConnectedProps, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {allChannelsConnected} from '../../selectors/channels';
import {listChannels} from '../../actions/channel';
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

//move this to services?
const SourcesInfo: SourceInfo[] = [
  {
    type: Source.chatPlugin,
    title: 'Airy Live Chat',
    description: 'Best of class browser messenger',
    image: <AiryAvatarIcon />,
    newChannelRoute: CONNECTORS_CHAT_PLUGIN_ROUTE + '/new',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/chatplugin',
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
    newChannelRoute: CONNECTORS_FACEBOOK_ROUTE + '/new',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/facebook',
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
    newChannelRoute: CONNECTORS_TWILIO_SMS_ROUTE + '/new_account',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.sms/#',
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
    newChannelRoute: CONNECTORS_TWILIO_WHATSAPP_ROUTE + '/new_account',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/twilio.whatsapp/#',
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
    newChannelRoute: CONNECTORS_GOOGLE_ROUTE + '/new_account',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/google',
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
    newChannelRoute: CONNECTORS_INSTAGRAM_ROUTE + '/new',
    channelsListRoute: CONNECTORS_CONNECTED_ROUTE + '/instagram',
    configKey: 'sources-facebook',
    channelsToShow: 4,
    itemInfoString: 'channels',
    dataCyAddChannelButton: cyChannelsInstagramAddButton,
    dataCyChannelList: cyChannelsInstagramList,
  },
];

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannelsConnected(state)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Connectors = (props: ConnectedProps<typeof connector>) => {
  const channels = useSelector((state: StateModel) => Object.values(allChannelsConnected(state)));
  const channelsBySource = (Source: Source) => channels.filter((channel: Channel) => channel.source === Source);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.channels.length === 0) {
      props.listChannels();
    }
    setPageTitle('Connectors');
  }, [props.channels.length]);

  return (
    <div className={styles.channelsWrapper}>
      <div className={styles.channelsHeadline}>
        <div>
          <h1 className={styles.channelsHeadlineText}>Connectors</h1>
        </div>
      </div>

      <div className={styles.wrapper}>
        {SourcesInfo.map((infoItem: SourceInfo) => {
          return (
            channelsBySource(infoItem.type).length > 0 && (
              <div style={{display: 'flex'}} key={infoItem.type}>
                <ChannelCard
                  installed
                  sourceInfo={infoItem}
                  addChannelAction={() => {
                    navigate(infoItem.channelsListRoute);
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

export default connector(Connectors);

import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {Route, RouteComponentProps, Switch} from 'react-router-dom';

import {listChannels} from '../../actions/channel';
import {StateModel} from '../../reducers/index';
import {allChannelsConnected} from '../../selectors/channels';
import {setPageTitle} from '../../services/pageTitle';

import MainPage from './MainPage';
import FacebookConnect from './Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './Providers/Airy/ChatPlugin/ChatPluginConnect';
import InstagramConnect from './Providers/Instagram/InstagramConnect';
import ConnectedChannelsList from './ConnectedChannelsList';
import TwilioSmsConnect from './Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './Providers/Google/GoogleConnect';

import styles from './index.module.scss';

import {
  CHANNELS_TWILIO_SMS_ROUTE,
  CHANNELS_FACEBOOK_ROUTE,
  CHANNELS_CONNECTED_ROUTE,
  CHANNELS_CHAT_PLUGIN_ROUTE,
  CHANNELS_TWILIO_WHATSAPP_ROUTE,
  CHANNELS_GOOGLE_ROUTE,
  CHANNELS_INSTAGRAM_ROUTE,
} from '../../routes/routes';

const mapDispatchToProps = {
  listChannels,
};

const mapStateToProps = (state: StateModel) => ({
  channels: Object.values(allChannelsConnected(state)),
  config: state.data.config,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

type ChannelsConnectProps = {} & ConnectedProps<typeof connector> & RouteComponentProps;

const Channels = (props: ChannelsConnectProps) => {
  useEffect(() => {
    if (props.channels.length == 0) {
      props.listChannels();
    }
    setPageTitle('Channels');
  }, []);

  const renderChannels = () => (
    <div className={styles.channelsWrapper}>
      <MainPage channels={props.channels} config={props.config} />
    </div>
  );

  return (
    <Switch>
      <Route path={[`${CHANNELS_FACEBOOK_ROUTE}/:channelId?`]} component={FacebookConnect} />
      <Route path={[`${CHANNELS_CHAT_PLUGIN_ROUTE}/:channelId?`]} component={ChatPluginConnect} />
      <Route path={[`${CHANNELS_CONNECTED_ROUTE}/:source?`]} component={ConnectedChannelsList} />
      <Route path={[`${CHANNELS_TWILIO_SMS_ROUTE}/:channelId?`]} component={TwilioSmsConnect} />
      <Route path={[`${CHANNELS_TWILIO_WHATSAPP_ROUTE}/:channelId?`]} component={TwilioWhatsappConnect} />
      <Route path={[`${CHANNELS_GOOGLE_ROUTE}/:channelId?`]} component={GoogleConnect} />
      <Route path={[`${CHANNELS_INSTAGRAM_ROUTE}/:channelId?`]} component={InstagramConnect} />
      <Route path="/" render={renderChannels} />
    </Switch>
  );
};

export default connector(Channels);

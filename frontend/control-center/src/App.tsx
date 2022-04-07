import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import TopBar from './components/TopBar';
import {Sidebar} from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes} from 'react-router-dom';
import {CATALOG_ROUTE, CHANNELS_ROUTE, ROOT_ROUTE, COMPONENTS_ROUTE} from './routes/routes';
import FacebookConnect from './pages/Channels/Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './pages/Channels/Providers/Airy/ChatPlugin/ChatPluginConnect';
import ConnectedChannelsList from './pages/Channels/ConnectedChannelsList';
import TwilioSmsConnect from './pages/Channels/Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './pages/Channels/Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './pages/Channels/Providers/Google/GoogleConnect';
import InstagramConnect from './pages/Channels/Providers/Instagram/InstagramConnect';
import NotFound from './pages/NotFound';
import ChannelsOutlet from './pages/Channels/ChannelsOutlet';
import Catalog from './pages/Catalog';
import Channels from './pages/Channels';
import Components from './pages/Components';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    props.getClientConfig();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <TopBar isAdmin={true} />
        <Sidebar />
        <Routes>
          <Route path={ROOT_ROUTE} element={<Navigate to={CHANNELS_ROUTE} replace />} />
          <Route path={`${CHANNELS_ROUTE}/*`} element={<ChannelsOutlet />}>
            <Route path={`facebook/:channelId`} element={<FacebookConnect />} />
            <Route path={`chatplugin/:channelId`} element={<ChatPluginConnect />} />
            <Route path={`connected/:source`} element={<ConnectedChannelsList />} />
            <Route path={`twilio.sms/:channelId`} element={<TwilioSmsConnect />} />
            <Route path={`twilio.whatsapp/:channelId`} element={<TwilioWhatsappConnect />} />
            <Route path={`google/:channelId`} element={<GoogleConnect />} />
            <Route path={`instagram/:channelId`} element={<InstagramConnect />} />
            <Route index element={<Channels />} />
          </Route>
          <Route element={<NotFound />} />
          <Route path={`${CATALOG_ROUTE}/*`} element={<Catalog />} />
          <Route path={`${COMPONENTS_ROUTE}/*`} element={<Components />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default connector(App);

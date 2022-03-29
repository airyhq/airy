import React from 'react';
import _, {connect} from 'react-redux';
import TopBar from './components/TopBar';
import {Sidebar} from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes} from 'react-router-dom';
import {CHANNELS_ROUTE, ROOT_ROUTE} from './routes/routes';
import Channels from './pages/Channels';
import FacebookConnect from './pages/Channels/Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './pages/Channels/Providers/Airy/ChatPlugin/ChatPluginConnect';
import ConnectedChannelsList from './pages/Channels/ConnectedChannelsList';
import TwilioSmsConnect from './pages/Channels/Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './pages/Channels/Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './pages/Channels/Providers/Google/GoogleConnect';
import InstagramConnect from './pages/Channels/Providers/Instagram/InstagramConnect';
import MainPage from './pages/Channels/MainPage';
import NotFound from './pages/NotFound';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <TopBar isAdmin={true} />
        <Sidebar />
        <Routes>
          <Route path={ROOT_ROUTE} element={<Navigate to={CHANNELS_ROUTE} replace />} />
          <Route path={`${CHANNELS_ROUTE}/*`} element={<Channels />}>
            <Route path={`facebook/:channelId`} element={<FacebookConnect />} />
            <Route path={`chatplugin/:channelId`} element={<ChatPluginConnect />} />
            <Route path={`connected/:source`} element={<ConnectedChannelsList />} />
            <Route path={`twilio.sms/:channelId`} element={<TwilioSmsConnect />} />
            <Route path={`twilio.whatsapp/:channelId`} element={<TwilioWhatsappConnect />} />
            <Route path={`google/:channelId`} element={<GoogleConnect />} />
            <Route path={`instagram/:channelId`} element={<InstagramConnect />} />
            <Route index element={<MainPage />} />
          </Route>
          <Route element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
};

export default connector(App);

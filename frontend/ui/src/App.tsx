import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import {Route, Routes, Navigate} from 'react-router-dom';

import TopBar from './components/TopBar';
import Channels from './pages/Channels';
import Inbox from './pages/Inbox';
import Tags from './pages/Tags';
import NotFound from './pages/NotFound';
import {Sidebar} from './components/Sidebar';
import AiryWebSocket from './components/AiryWebsocket';
import {fakeSettingsAPICall} from './actions';

import {INBOX_ROUTE, CHANNELS_ROUTE, ROOT_ROUTE, TAGS_ROUTE} from './routes/routes';

import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import ConnectedChannelsList from './pages/Channels/ConnectedChannelsList';
import FacebookConnect from './pages/Channels/Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './pages/Channels/Providers/Airy/ChatPlugin/ChatPluginConnect';
import TwilioSmsConnect from './pages/Channels/Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './pages/Channels/Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './pages/Channels/Providers/Google/GoogleConnect';
import InstagramConnect from './pages/Channels/Providers/Instagram/InstagramConnect';
import MainPage from './pages/Channels/MainPage';

const mapDispatchToProps = {
  fakeSettingsAPICall,
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    props.fakeSettingsAPICall();
    props.getClientConfig();
  }, []);

  return (
    <AiryWebSocket>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <>
            <TopBar isAdmin={true} />
            <Sidebar />
          </>
          <Routes>
            <Route path={ROOT_ROUTE} element={<Navigate to={INBOX_ROUTE} replace />} />
            <Route path={TAGS_ROUTE} element={<Tags />} />
            <Route path={INBOX_ROUTE} element={<Inbox />} />
            <Route path={`/inbox/conversations/:conversationId`} element={<Inbox />} />
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
    </AiryWebSocket>
  );
};

export default connector(App);

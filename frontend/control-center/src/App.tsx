import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import TopBar from './components/TopBar';
import {Sidebar} from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes} from 'react-router-dom';
import {CATALOG_ROUTE, CONNECTORS_ROUTE, ROOT_ROUTE} from './routes/routes';
import FacebookConnect from './pages/Connectors/Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './pages/Connectors/Providers/Airy/ChatPlugin/ChatPluginConnect';
import ConnectedConnectorsList from './pages/Connectors/ConnectedConnectorsList';
import TwilioSmsConnect from './pages/Connectors/Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './pages/Connectors/Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './pages/Connectors/Providers/Google/GoogleConnect';
import InstagramConnect from './pages/Connectors/Providers/Instagram/InstagramConnect';
import NotFound from './pages/NotFound';
import ConnectorsOutlet from './pages/Connectors/ConnectorsOutlet';
import Catalog from './pages/Catalog';
import Connectors from './pages/Connectors';

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
          <Route path={ROOT_ROUTE} element={<Navigate to={CONNECTORS_ROUTE} replace />} />
          <Route path={`${CONNECTORS_ROUTE}/*`} element={<ConnectorsOutlet />}>
            <Route path={`facebook/:channelId`} element={<FacebookConnect />} />
            <Route path={`chatplugin/:channelId`} element={<ChatPluginConnect />} />
            <Route path={`connected/:source`} element={<ConnectedConnectorsList />} />
            <Route path={`twilio.sms/:channelId`} element={<TwilioSmsConnect />} />
            <Route path={`twilio.whatsapp/:channelId`} element={<TwilioWhatsappConnect />} />
            <Route path={`google/:channelId`} element={<GoogleConnect />} />
            <Route path={`instagram/:channelId`} element={<InstagramConnect />} />
            <Route index element={<Connectors />} />
          </Route>
          <Route element={<NotFound />} />
          <Route path={`${CATALOG_ROUTE}/*`} element={<Catalog />} />
        </Routes>
      </div>
    </div>
  );
};

export default connector(App);

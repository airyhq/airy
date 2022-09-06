import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes} from 'react-router-dom';
import {INBOX_ROUTE, CATALOG_ROUTE, CONNECTORS_ROUTE, ROOT_ROUTE, STATUS_ROUTE, WEBHOOKS_ROUTE} from './routes/routes';
import FacebookConnect from './pages/Connectors/Providers/Facebook/Messenger/FacebookConnect';
import ChatPluginConnect from './pages/Connectors/Providers/Airy/ChatPlugin/ChatPluginConnect';
import ConnectedChannelsList from './pages/Connectors/ConnectedChannelsList';
import TwilioSmsConnect from './pages/Connectors/Providers/Twilio/SMS/TwilioSmsConnect';
import TwilioWhatsappConnect from './pages/Connectors/Providers/Twilio/WhatsApp/TwilioWhatsappConnect';
import GoogleConnect from './pages/Connectors/Providers/Google/GoogleConnect';
import InstagramConnect from './pages/Connectors/Providers/Instagram/InstagramConnect';
import NotFound from './pages/NotFound';
import ConnectorsOutlet from './pages/Connectors/ConnectorsOutlet';
import Catalog from './pages/Catalog';
import CatalogOutlet from './pages/Catalog/CatalogOutlet';
import Connectors from './pages/Connectors';
import Webhooks from './pages/Webhooks';
import Status from './pages/Status';
import Inbox from './pages/Inbox';
import ChannelsList from './pages/Inbox/ChannelsList';
import InboxOutlet from './pages/Inbox/InboxOutlet';
import ConnectorConfig from './pages/Connectors/ConnectorConfig';
import CatalogProductPage from './pages/Catalog/CatalogItemDetails';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    props.getClientConfig();
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <TopBar isAdmin={true} />
        <Sidebar />
        <Routes>
          <Route path={ROOT_ROUTE} element={<Navigate to={STATUS_ROUTE} replace />} />

          <Route path={CONNECTORS_ROUTE} element={<Connectors />} />

          <Route path={`${CONNECTORS_ROUTE}/:source/*`} element={<ConnectorsOutlet />}>
            <Route path={`connected`} element={<ConnectorConfig />} />
            <Route path={`new`} element={<ConnectorConfig />} />
            <Route path={`:channelId`} element={<ConnectorConfig />} />
          </Route>

          <Route path={`${CATALOG_ROUTE}/*`} element={<CatalogOutlet />}>
            <Route path={`facebook/:channelId`} element={<FacebookConnect />} />
            <Route path={`chatplugin/:channelId`} element={<ChatPluginConnect />} />
            <Route path={`connected/:source`} element={<ConnectedChannelsList />} />
            <Route path={`twilio.sms/:channelId`} element={<TwilioSmsConnect />} />
            <Route path={`twilio.whatsapp/:channelId`} element={<TwilioWhatsappConnect />} />
            <Route path={`google/:channelId`} element={<GoogleConnect />} />
            <Route path={`instagram/:channelId`} element={<InstagramConnect />} />

            <Route path={`:componentName`} element={<CatalogProductPage />} />
            <Route index element={<Catalog />} />
          </Route>

          <Route path={`${INBOX_ROUTE}/*`} element={<InboxOutlet />}>
            <Route path={`facebook/:channelId`} element={<FacebookConnect />} />
            <Route path={`chatplugin/:channelId`} element={<ChatPluginConnect />} />
            <Route path={`connected/:source`} element={<ChannelsList />} />
            <Route path={`twilio.sms/:channelId`} element={<TwilioSmsConnect />} />
            <Route path={`twilio.whatsapp/:channelId`} element={<TwilioWhatsappConnect />} />
            <Route path={`google/:channelId`} element={<GoogleConnect />} />
            <Route path={`instagram/:channelId`} element={<InstagramConnect />} />
            <Route index element={<Inbox />} />
          </Route>

          <Route element={<NotFound />} />
          <Route path={`${WEBHOOKS_ROUTE}/*`} element={<Webhooks />} />
          <Route path={`${STATUS_ROUTE}`} element={<Status />} />
        </Routes>
      </div>
    </div>
  );
};

export default connector(App);

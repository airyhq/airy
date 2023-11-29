import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
import {
  INBOX_ROUTE,
  CATALOG_ROUTE,
  CONNECTORS_ROUTE,
  ROOT_ROUTE,
  STATUS_ROUTE,
  WEBHOOKS_ROUTE,
  APPS_ROUTE,
  FEAST_ROUTE,
  STREAMS_ROUTE,
  TOPICS_ROUTE,
  SCHEMAS_ROUTE,
  LLMS_ROUTE,
  LLM_CONSUMERS_ROUTE,
} from './routes/routes';
import NotFound from './pages/NotFound';
import ConnectorsOutlet from './pages/Connectors/ConnectorsOutlet';
import Catalog from './pages/Catalog';
import CatalogOutlet from './pages/Catalog/CatalogOutlet';
import Connectors from './pages/Connectors';
import Webhooks from './pages/Webhooks';
import Status from './pages/Status';
import Inbox from './pages/Inbox';
import ConnectorConfig from './pages/Connectors/ConnectorConfig';
import CatalogProductPage from './pages/Catalog/CatalogItemDetails';
import AiryWebSocket from './components/AiryWebsocket';
import {getConnectorsConfiguration, listChannels, listComponents} from './actions';
import Apps from './pages/Apps';
import ExternalView from './components/ExternalView';
import {getAppExternalURL} from './services/getAppExternalURL';
import Streams from './pages/Streams';
import Topics from './pages/Topics';
import Schemas from './pages/Schemas';
import LLMs from './pages/LLMs';
import LLMConsumers from './pages/LLMConsumers';

const mapDispatchToProps = {
  getClientConfig,
  listChannels,
  getConnectorsConfiguration,
  listComponents,
};

const connector = connect(null, mapDispatchToProps);

const App = (props: ConnectedProps<typeof connector>) => {
  const location = useLocation();

  useEffect(() => {
    props.getClientConfig().catch((error: Error) => {
      console.error(error);
    });
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  useEffect(() => {
    props.listChannels().catch((error: Error) => {
      console.error(error);
    });
    props.getConnectorsConfiguration().catch((error: Error) => {
      console.error(error);
    });
    props.listComponents().catch((error: Error) => {
      console.error(error);
    });
  }, [location]);

  return (
    <AiryWebSocket>
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
              <Route path={`configure`} element={<ConnectorConfig />} />
              <Route path={`:channelId`} element={<ConnectorConfig />} />
            </Route>

            <Route path={APPS_ROUTE} element={<Apps />} />
            <Route path={FEAST_ROUTE} element={<ExternalView url={getAppExternalURL(FEAST_ROUTE)} />} />

            <Route path={`${APPS_ROUTE}/:source/*`} element={<ConnectorsOutlet />}>
              <Route path={`connected`} element={<ConnectorConfig />} />
              <Route path={`new`} element={<ConnectorConfig />} />
              <Route path={`configure`} element={<ConnectorConfig />} />
              <Route path={`:channelId`} element={<ConnectorConfig />} />
            </Route>

            <Route path={`${CATALOG_ROUTE}/*`} element={<CatalogOutlet />}>
              <Route path={`:componentName`} element={<CatalogProductPage />} />
              <Route index element={<Catalog />} />
            </Route>

            <Route path={`${TOPICS_ROUTE}/*`} element={<Topics />} />
            <Route path={`${SCHEMAS_ROUTE}/*`} element={<Schemas />} />
            <Route path={`${STREAMS_ROUTE}/*`} element={<Streams />} />

            <Route path={`${INBOX_ROUTE}/*`} element={<Inbox />} />

            <Route element={<NotFound />} />
            <Route path={`${WEBHOOKS_ROUTE}/*`} element={<Webhooks />} />
            <Route path={`${LLMS_ROUTE}/*`} element={<LLMs />} />
            <Route path={`${LLM_CONSUMERS_ROUTE}/*`} element={<LLMConsumers />} />
            <Route path={`${STATUS_ROUTE}`} element={<Status />} />
          </Routes>
        </div>
      </div>
    </AiryWebSocket>
  );
};

export default connector(App);

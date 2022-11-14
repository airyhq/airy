import React, {useEffect} from 'react';
import _, {connect, ConnectedProps} from 'react-redux';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import styles from './App.module.scss';
import {getClientConfig} from './actions/config';
import {Navigate, Route, Routes} from 'react-router-dom';
import {INBOX_ROUTE, CATALOG_ROUTE, CONNECTORS_ROUTE, ROOT_ROUTE, STATUS_ROUTE, WEBHOOKS_ROUTE} from './routes/routes';
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

            <Route path={`${CATALOG_ROUTE}/*`} element={<CatalogOutlet />}>
              <Route path={`:componentName`} element={<CatalogProductPage />} />
              <Route index element={<Catalog />} />
            </Route>

            <Route path={`${INBOX_ROUTE}/*`} element={<Inbox />} />

            <Route element={<NotFound />} />
            <Route path={`${WEBHOOKS_ROUTE}/*`} element={<Webhooks />} />
            <Route path={`${STATUS_ROUTE}`} element={<Status />} />
          </Routes>
        </div>
      </div>
    </AiryWebSocket>
  );
};

export default connector(App);

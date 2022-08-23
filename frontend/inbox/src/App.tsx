import React, {useEffect} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Route, Routes, Navigate} from 'react-router-dom';

import TopBar from './components/TopBar';
import Inbox from './pages/Inbox';
import Tags from './pages/Tags';
import Contacts from './pages/Contacts';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import AiryWebSocket from './components/AiryWebsocket';

import {CONTACTS_ROUTE, INBOX_ROUTE, ROOT_ROUTE, TAGS_ROUTE} from './routes/routes';

import styles from './App.module.scss';
import {getClientConfig} from './actions/config';

const mapDispatchToProps = {
  getClientConfig,
};

const connector = connect(null, mapDispatchToProps);

const App = (props: ConnectedProps<typeof connector>) => {
  useEffect(() => {
    props.getClientConfig().catch((error: Error) => {
      console.error(error);
    });
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
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
            <Route path={CONTACTS_ROUTE} element={<Contacts />} />
            <Route path={`/inbox/conversations/:conversationId`} element={<Inbox />} />
            <Route element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </AiryWebSocket>
  );
};

export default connector(App);

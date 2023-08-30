import React, {useEffect, useState} from 'react';
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
import {createChannelForNewUser, getGmailEmail, getTokens, initializeOauth} from './services';
import {listChannels} from './actions';
import {env} from './env';
import {Channel} from 'model';

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}

const mapDispatchToProps = {
  getClientConfig,
  listChannels,
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

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get('code');
    if (code) getTokens(code, response => setIsGoogleLoggedIn(JSON.stringify(response)));
  }, []);

  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(localStorage.getItem('googleCredentials'));

  useEffect(() => {
    if (isGoogleLoggedIn) {
      props.listChannels().then((channelList: Channel[]) => {
        const userId = getGmailEmail();        
        const existingChannel = channelList.filter(channel => channel.sourceChannelId === userId);
        if (!!existingChannel.length) {
          createChannelForNewUser(userId, existingChannel[0]);
        } else {
          createChannelForNewUser(userId, null);
        }
      });
    }
  }, [isGoogleLoggedIn]);

  useEffect(() => {
    initializeOauth();
    window.google.accounts.id.renderButton(document.getElementById('g_id_onload'), {theme: 'outline', size: 'large'});
  }, []);

  if (!isGoogleLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <>
            <TopBar isAdmin={true} />
          </>
          <div
            className={styles.googleButton}
            id="g_id_onload"
            data-client_id={env.GOOGLE_CLIENT_ID}
            data-callback="handleCredentialResponse"
            data-scope="https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send"
          ></div>
        </div>
      </div>
    );
  }

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

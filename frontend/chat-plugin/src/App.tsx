import React, {Component} from 'react';

import style from './App.module.scss';
import Chat from './components/chat';

export default class App extends Component {
  render() {
    const queryParams = new URLSearchParams(window.location.search);
    const channelId = queryParams.get('channel_id');

    return (
      <div className={style.container}>
        {channelId ? (
          <Chat channelId={channelId} />
        ) : (
          <span style={{color: 'red'}}>Widget authorization failed. Please check your installation.</span>
        )}
      </div>
    );
  }
}

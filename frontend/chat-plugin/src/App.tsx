import React, {Component} from 'react';
import {Router} from 'preact-router';

import ChatRoute from './routes/chat';

import style from './App.module.scss';

export default class App extends Component {
  currentUrl: string = null;

  handleRoute = (e: any) => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <div className={style.container}>
        <Router onChange={this.handleRoute}>
          <ChatRoute path={'/'} />
        </Router>
      </div>
    );
  }
}

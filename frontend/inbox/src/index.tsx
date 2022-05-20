import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {store} from './store';
import './index.scss';
import './assets/scss/reset.scss';
import 'translations';

const render = async () => {
  const App = (await import('./App')).default;
  const RootContainer = () => (
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <App />
      </BrowserRouter>
    </Provider>
  );

  ReactDOM.render(<RootContainer />, document.getElementById('root'));
};

render();

declare const module: any;

if (module.hot) {
  module.hot.accept('./App', () => {
    render();
  });
}
import 'core-js';
import 'regenerator-runtime/runtime';

import React from 'react';
import {render} from 'react-dom';

const renderMethod = async () => {
  const App = (await import('./App')).default;
  render(<App />, document.getElementById('root'));
};

renderMethod();

declare const module: any;

if (module.hot) {
  module.hot.accept('./App', () => {
    renderMethod();
  });
}

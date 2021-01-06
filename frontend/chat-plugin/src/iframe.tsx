import {h, render} from 'preact';

const renderMethod = () => {
  const App = require('./App').default;
  render(<App />, document.getElementById('root'));
};

renderMethod();

declare const module: any;

if (module.hot) {
  module.hot.accept('./App', () => {
    renderMethod();
  });
}

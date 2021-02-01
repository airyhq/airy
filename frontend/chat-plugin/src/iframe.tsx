import 'core-js';
import 'regenerator-runtime/runtime';
import {h, render} from 'preact';

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

const path = require('path');

const argv = require('minimist')(process.argv.slice(2));
console.debug('argv', argv);
const configGenerator = require(path.resolve(argv.config));
console.log('cwd', process.cwd());

const config = configGenerator(process.env, argv);
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const options = {
  contentBase: false,
  hot: true,
  host: 'localhost',
  historyApiFallback: true,
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

const port = process.env.PORT || 8080;

server.listen(port, 'localhost', () => {
  console.log(`dev server listening on port ${port}`);
});

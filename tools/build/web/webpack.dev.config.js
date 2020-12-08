const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// For dev the tsconfig-paths-webpack-plugin doesn't cut it, as it links to file locations
// that are only available to build rules
function resolveTsconfigPathsToAlias({tsconfigPath, basePath}) {
  const {paths} = require(tsconfigPath).compilerOptions;

  const stripGlobs = path => path.replace('/*', '');

  return Object.keys(paths).reduce((aliases, moduleMappingKey) => {
    const key = stripGlobs(moduleMappingKey);
    const value = path.resolve(basePath, stripGlobs(paths[moduleMappingKey][0]).replace('*', ''));

    return {
      ...aliases,
      [key]: value,
    };
  }, {});
}

module.exports = (env, argv) => ({
  mode: 'development',
  target: 'web',
  bail: false,

  entry: ['react-hot-loader/patch', 'webpack-hot-middleware/client', path.resolve(argv.entry)],

  output: {
    publicPath: '/',
  },

  optimization: {
    minimize: false,
  },

  resolve: {
    alias: resolveTsconfigPathsToAlias({
      tsconfigPath: path.resolve(argv.tsconfig),
      basePath: process.cwd(),
    }),
  },

  devtool: 'cheap-module-eval-source-map',

  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'entry',
                corejs: 3,
                modules: false,
                targets: ['>0.2%', 'not dead', 'not op_mini all'],
              },
            ],
          ],
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                auto: true,
                localIdentName: '[name]_[local]-[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgoConfig: {
                plugins: {
                  removeViewBox: false,
                },
              },
              template: ({template}, opts, {imports, interfaces, componentName, props, jsx, exports}) => {
                const plugins = ['jsx'];
                if (opts.typescript) {
                  plugins.push('typescript');
                }
                const typeScriptTpl = template.smart({plugins});
                return typeScriptTpl.ast`
                                    ${imports}
                                    ${interfaces}
                                    function ${componentName}(${props}) {
                                      props = { title: '', ...props };
                                      return ${jsx};
                                    }
                                    ${exports}
                                    `;
              },
            },
          },
          // Use url-loader to be able to inject into img src
          // https://www.npmjs.com/package/@svgr/webpack#using-with-url-loader-or-file-loader
          'url-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': "'development'",
    }),
    new CopyWebpackPlugin([
      {
        from: '**/public/**/*',
        ignore: ['**/node_modules/**'],
        transformPath(targetPath) {
          const splits = targetPath.split('public/');
          return splits[1];
        },
      },
    ]),
    new HtmlWebpackPlugin({
      template: '!!ejs-compiled-loader!' + path.resolve(argv.index),
      inject: true,
      filename: 'index.html',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
});

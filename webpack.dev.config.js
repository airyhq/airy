const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// For dev the tsconfig-paths-webpack-plugin doesn't cut it, as it links to file locations
// that are only available to build rules
function resolveTsconfigPathsToAlias({tsconfigPath, basePath}) {
  console.debug('tsconfigPath', tsconfigPath);
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

module.exports = (env, argv) => {
  const output = {
    publicPath: '/',
    // ...JSON.parse(argv.outputDict || "{}"),
  };

  return {
    mode: 'development',
    target: 'web',
    bail: false,

    entry: ['react-hot-loader/patch', path.resolve(argv.entry)],

    output,

    optimization: {
      minimize: false,
    },

    resolve: {
      alias: resolveTsconfigPathsToAlias({
        tsconfigPath: path.resolve(argv.tsconfig),
        basePath: process.cwd(),
      }),
      extensions: ['.tsx', '.ts', '.js'],
    },

    devtool: 'eval-cheap-module-source-map',

    module: {
      rules: [
        /*{
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            configFile: 'dev.tsconfig.json',
          },
        }*/
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  modules: false,
                  corejs: 3,
                  targets: ['>0.2%', 'not dead', 'not op_mini all'],
                },
              ],
              '@babel/preset-react',
              ['@babel/preset-typescript', {isTSX: true, allExtensions: true}],
            ],
            plugins: [
              '@babel/plugin-transform-spread',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
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
        'process.env.NODE_ENV': `"development"`,
        'process.env.PUBLIC_PATH': `'${output.publicPath}'`,
        ...JSON.parse(argv.defines || '{}'),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(argv.index),
        inject: true,
        filename: 'index.html',
      }),
    ],
  };
};

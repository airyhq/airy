const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

function resolveTsconfigPathsToAlias({tsconfigPath, basePath}) {
  const {paths} = require(tsconfigPath).compilerOptions;
  const stripGlobs = path => path.replace('/*', '');

  return Object.keys(paths).reduce((aliases, moduleMappingKey) => {
    const key = stripGlobs(moduleMappingKey);
    const value = path.resolve(basePath, stripGlobs(paths[moduleMappingKey][1]).replace('*', ''));

    return {
      ...aliases,
      [key]: value,
    };
  }, {});
}

const parseBazelDict = output => {
  if (!output) {
    return {};
  }

  return output.split('|').reduce((acc, it) => {
    const keyValue = it.split('=');
    return {
      ...acc,
      [keyValue[0]]: keyValue[1],
    };
  }, {});
};

module.exports = (env, argv) => ({
  mode: 'production',
  target: 'web',
  bail: true, // stop compilation on first error
  resolve: {
    alias: resolveTsconfigPathsToAlias({
      tsconfigPath: path.resolve(argv.tsconfig),
      basePath: process.cwd(),
    }),
  },
  output: {
    path: path.resolve(argv.path),
    ...parseBazelDict(argv.outputDict),
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  devtool: 'none',

  externals: {
    ...parseBazelDict(argv.externalDict),
  },

  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: false,
          presets: [
            [
              '@babel/preset-env',
              {
                modules: 'auto',
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
        loader: 'url-loader',
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

              // adapted from the default template
              // https://github.com/gregberge/svgr/blob/master/packages/babel-plugin-transform-svg-component/src/index.js
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
      'process.env.NODE_ENV': "'production'",
    }),
    /* Uncomment to get bundle report
        new require('webpack-bundle-analyzer').BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        }),*/
  ],
});

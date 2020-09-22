const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// For dev the tsconfig-paths-webpack-plugin doesn't cut it, as it links to file locations
// that are only available to build rules
function resolveTsconfigPathsToAlias({ tsconfigPath, basePath }) {
  const { paths } = require(tsconfigPath).compilerOptions;

  const stripGlobs = path => path.replace("/*", "");

  return Object.keys(paths).reduce((aliases, moduleMappingKey) => {
    const key = stripGlobs(moduleMappingKey);
    const value = path.resolve(
      basePath,
      stripGlobs(paths[moduleMappingKey][0]).replace("*", "")
    );

    return {
      ...aliases,
      [key]: value
    };
  }, {});
}

module.exports = (env, argv) => ({
  mode: "development",
  target: "web",
  bail: false,

  entry: [
    "react-hot-loader/patch",
    "webpack-hot-middleware/client",
    path.resolve(argv.entry)
  ],

  output: {
    publicPath: "/"
  },

  optimization: {
    minimize: false
  },

  resolve: {
    alias: resolveTsconfigPathsToAlias({
      tsconfigPath: path.resolve(argv.tsconfig),
      basePath: process.cwd()
    })
  },

  devtool: "cheap-module-eval-source-map",

  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "entry",
                corejs: 3,
                modules: false,
                targets: [">0.2%", "not dead", "not op_mini all"]
              }
            ]
          ]
        }
      },
      {
        test: /\.module\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]"
              }
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /(?<!\.module)\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|svg)(\?.*)?$/,
        loader: "file-loader",
        options: {
          name: "media/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'development'"
    }),
    new CopyWebpackPlugin([
      {
        from: "**/public/**/*",
        ignore: ["**/node_modules/**"],
        transformPath(targetPath) {
          const splits = targetPath.split("public/");
          return splits[1];
        }
      }
    ]),
    new HtmlWebpackPlugin({
      template: "!!ejs-compiled-loader!" + path.resolve(argv.index),
      inject: true,
      filename: "index.html"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});

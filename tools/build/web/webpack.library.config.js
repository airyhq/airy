const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

function resolveTsconfigPathsToAlias({ tsconfigPath, basePath }) {
  const { paths } = require(tsconfigPath).compilerOptions;
  const stripGlobs = path => path.replace("/*", "");

  return Object.keys(paths).reduce((aliases, moduleMappingKey) => {
    const key = stripGlobs(moduleMappingKey);
    const value = path.resolve(
      basePath,
      stripGlobs(paths[moduleMappingKey][1]).replace("*", "")
    );

    return {
      ...aliases,
      [key]: value
    };
  }, {});
}

const parseOutput = output => {
  return output.split("|").reduce((acc, it) => {
    const keyValue = it.split("=");
    return {
      ...acc,
      [keyValue[0]]: keyValue[1]
    };
  }, {});
};

module.exports = (env, argv) => ({
  mode: "production",
  target: "web",
  bail: true, // stop compilation on first error
  resolve: {
    alias: resolveTsconfigPathsToAlias({
      tsconfigPath: path.resolve(argv.tsconfig),
      basePath: process.cwd()
    })
  },
  output: {
    path: path.resolve(argv.path),
    ...parseOutput(argv.outputDict)
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        sourceMap: false
      })
    ],
    // Extract all styles into one sheet
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },

  devtool: "none",

  module: {
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: false,
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
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'production'"
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false
    }),
    new OptimizeCSSAssetsPlugin()
  ]
});

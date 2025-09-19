const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const TailwindWatcherPlugin = require('./webpack.tailwind-watcher.js');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/renderer/index.tsx',
  target: 'electron-renderer',
  devtool: 'eval-source-map', // Faster source maps for development
  devServer: {
    hot: true,
    liveReload: true,
    watchFiles: {
      paths: ['src/**/*', 'src/renderer/styles/**/*.css', 'tailwind.config.js'],
      options: {
        usePolling: false, // Use native file watching (faster)
        interval: 100, // Check every 100ms when polling
      },
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  watchOptions: {
    ignored: ['node_modules/**', '.git/**', 'dist/**', '.webpack/**'],
    poll: false, // Use native file watching
    aggregateTimeout: 200, // Faster rebuild delay
    followSymlinks: false,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // Skip type checking for faster compilation
            experimentalWatchApi: true, // Use faster watch mode
            configFile: 'tsconfig.json',
            compilerOptions: {
              incremental: true, // Enable incremental compilation
            }
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag', // Force single style tag for HMR
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true, // Enable source maps for debugging
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, '.webpack/renderer'),
    filename: 'index.js',
    publicPath: './',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new TailwindWatcherPlugin({
      watchPath: './src/renderer/styles/output.css',
      watchTypeScript: true
    }),
  ],
  externals: {
    'electron': 'require("electron")'
  }
};
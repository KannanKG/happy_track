const path = require('path');

module.exports = {
  entry: './src/main.ts',
  target: 'electron-main',
  mode: process.env.NODE_ENV || 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    ignored: ['node_modules/**', '.git/**', 'dist/**', '.webpack/**'],
    poll: false, // Use native file watching
    aggregateTimeout: 200, // Faster rebuild delay
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: /src/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            experimentalWatchApi: true,
            compilerOptions: {
              incremental: true,
            },
          },
        }],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '.webpack/main'),
    filename: 'index.js',
  },
};
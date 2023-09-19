const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === 'development';
const IS_PROD = NODE_ENV === 'production';
const GLOBAL_CSS_REGEXP = /\.global\.css$/;

function setupDevtool() {
  if (IS_DEV) return 'eval';
  if (IS_PROD) return false;
}

module.exports = {
  mode: NODE_ENV ? NODE_ENV : 'development',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@UI': path.resolve(__dirname, 'src/UI'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@__mocks__': path.resolve(__dirname, 'src/__mocks__'),
    },
  },
  entry: [
    path.resolve(__dirname, '../src/client/index.jsx'),
    'webpack-hot-middleware/client?path=http://localhost:3001/static/__webpack_hmr',
  ],
  output: {
    path: path.resolve(__dirname, '../dist/client'),
    // filename: '[name].[contenthash].js',
    // chunkFilename: '[name].[contenthash].js',
    filename: 'client.js',
    publicPath: '/static/',
    assetModuleFilename: 'client/assets/[hash][ext]',
  },
  watchOptions: {
    ignored: /node_modules/,
    poll: 1000,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
      },
      {
        test: /\.css$/i,
        exclude: GLOBAL_CSS_REGEXP,
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: GLOBAL_CSS_REGEXP,
        use: [IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'client/assets/images/[name].[contenthash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'client/assets/fonts/[name][ext]',
        },
      },
      {
        test: /\.(mp4|pdf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'client/assets/video/[name].[contenthash][ext]',
        },
      },
    ],
  },

  plugins: IS_DEV ? [
    new CleanWebpackPlugin(),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: 'public/favicons', to: 'favicons' }],
    // }),
  ] : [
    new CssMinimizerPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [{ from: 'public/favicons', to: 'favicons' }],
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],

  devServer: {
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true,
  },

  optimization: {
    minimize: true,
    usedExports: true,
    // runtimeChunk: 'single',
    // splitChunks: {

    //   minSize: 17000,
    //   minRemainingSize: 0,
    //   minChunks: 1,
    //   maxAsyncRequests: 30,
    //   maxInitialRequests: 30,
    //   automaticNameDelimiter: '_',
    //   enforceSizeThreshold: 30000,
    //   cacheGroups: {
    //     common: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -5,
    //       reuseExistingChunk: true,
    //       chunks: 'initial',
    //       name: 'common_app',
    //       minSize: 0,
    //     },
    //     default: {
    //       minChunks: 2,
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //     defaultVendors: false,
    //     reactPackage: {
    //       test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
    //       name: 'vendor_react',
    //       chunks: 'all',
    //       priority: 10,
    //     },
    //   },
    // },
    minimizer: IS_PROD ? [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ] : [],
  },

  devtool: setupDevtool(),
};

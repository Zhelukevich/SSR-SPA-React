const path = require('path');

const express = require('express');
const webpack = require('webpack');
const nodemon = require('nodemon');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const [webpackClientConfig, webpackServerConfig] = require('../webpack.config');

const hmrServer = express();
const clientCompiler = webpack(webpackClientConfig);

hmrServer.use(webpackDevMiddleware(clientCompiler, {
  publicPath: webpackClientConfig.output.publicPath,
  serverSideRender: true,
  writeToDisk: true,
  stats: 'errors-only',
}));

hmrServer.use(webpackHotMiddleware(clientCompiler, {
  path: '/static/__webpack_hmr',
}));

// hmrServer.use(webpackHotMiddleware(clientCompiler));

hmrServer.listen(3001, () => {
  console.log('Hmr Server successfully started');
});

const compiler = webpack(webpackServerConfig);

compiler.run((err) => {
  if (err) {
    console.log('Compilation failed: ', err);
  }

  compiler.watch({}, (err) => {
    if (err) {
      console.log('Compilation failed: ', err);
    }
    console.log('Compilation was successful');
  });

  nodemon({
    script: path.resolve(__dirname, '../dist/server/server.js'),
    watch: [
      path.resolve(__dirname, '../dist'),
      path.resolve(__dirname, '../dist/client'),
    ],
  });
});

#!/usr/bin/env node
const httpProxy = require('http-proxy');
const http = require('http');
const program = require('commander');

const startServer = require('./startServer.js');
const DEFAULT_PROXY = 'localhost:8888'; // Charles default configuration
program
  .arguments('<port> <targetUrl> [proxy]')
  .action((port, targetUrl, proxy = DEFAULT_PROXY) => {
    const portNum = parseInt(port, 10);
    if (portNum < 1000 || portNum > 65000) {
      console.log('Provide a valid port number 1000 - 65000');
      process.exit(1);
    }

    if (targetUrl.startsWith('https://')) {
      console.log('Secure websocket is not supported at the moment');
      process.exit(1);
    }

    if (!targetUrl.startsWith('http://')) {
      console.log('Provide a full target url like `http://your.server:port`');
      process.exit(1);
    }

    const [proxyServer, proxyPort] = proxy.split(':');
    if (!proxyServer || !proxyPort) {
      console.log(`Invalid proxy server ${proxy}. Use the following syntax \`localhost:8888\``);
      process.exit(1);
    }

    startServer(port, targetUrl, proxyServer, proxyPort);
  });

program.parse(process.argv);
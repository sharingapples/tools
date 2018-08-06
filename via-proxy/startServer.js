const httpProxy = require('http-proxy');
const http = require('http');
const moment = require('moment');
const colors = require('colors');

// Keep track of all the sockets
const sockets = new Set();

function cleanUp(socket) {
  return () => {
    sockets.delete(socket);
    socket.end();
  };
}

function collectSocket(socket) {
  sockets.add(socket);

  socket.on('error', cleanUp(socket));
  socket.on('close', cleanUp(socket));
}

module.exports = function startServer(port, targetUrl, proxyServer, proxyPort) {
  console.log(`Listening for requests at ${port}`);
  console.log(' > Forwarding to', colors.bold.yellow(targetUrl), `via ${proxyServer}:${proxyPort}`);

  // Setup a proxy server to forward requests to the proxy server
  const proxy = httpProxy.createProxyServer({
    target: {
      host: proxyServer,
      port: proxyPort,
    },
    toProxy: true,
  });

  const server = http.createServer((req, res) => {
    res.writeHead(404, { 'ContentType': 'text/plain' });
    res.write('Only supports websocket');
    res.end();
  });

  server.on('upgrade', (req, socket, head) => {
    const proxyUrl = `${targetUrl}${req.url}`;
    collectSocket(socket);

    console.log('  >>', colors.green(moment().format('HH:MM:SS')), 'Upgrading', colors.cyan(req.url));
    req.url = proxyUrl;
    proxy.ws(req, socket, head);
  });

  server.listen(port);
}

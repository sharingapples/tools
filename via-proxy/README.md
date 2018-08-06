# via-proxy
A simple cli to force your websocket requests via proxy.

I created it since, my websocket requests and node requests (made through WebSocket library)
were not using the proxy configuration. So, as a workaround, I created this simple tool that
listens for requests on a port and forward it via the proxy.

# Usage
> `$ yarn global add via-proxy`

or

> `$ npm install -g via-proxy`

and issue the following command
> `$ via-proxy <port> <targetUrl> [proxy]`

Ex:
> `$ via-proxy 4040 http://192.168.2.2:8080 localhost:8888`

After that you should forward your websocket requests to `ws://localhost:4040` instead of `ws://192.168.2.2:8080`.


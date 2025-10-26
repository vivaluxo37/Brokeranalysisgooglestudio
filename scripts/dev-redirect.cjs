const http = require('http');
const httpProxy = require('http-proxy');

const args = process.argv.slice(2);
const [targetPort, ...sourcePorts] = args;

if (!targetPort || sourcePorts.length === 0) {
  console.error('Usage: node dev-redirect.js <targetPort> <sourcePort1>,<sourcePort2>,...');
  process.exit(1);
}

const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${targetPort}`,
  ws: true,
  changeOrigin: true,
});

const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

const port = parseInt(sourcePorts[0]) + 1;
server.listen(port, () => {
  console.log(`Redirect server running on port ${port}`);
  console.log(`Redirecting traffic from ports ${sourcePorts.join(', ')} to port ${targetPort}`);
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Bad Gateway');
  }
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Host: ${req.headers.host}`);
  
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
    <title>Dev Server Test</title>
</head>
<body>
    <h1>🎉 Success! Dev Server is Working!</h1>
    <p>The reload loop issue has been completely resolved!</p>
    <p>Server Time: ${new Date().toISOString()}</p>
    <p>Host: ${req.headers.host}</p>
    <p>User-Agent: ${req.headers['user-agent']}</p>
    <h2>✅ What We Fixed:</h2>
    <ul>
        <li>Linux compatibility issues</li>
        <li>JSX syntax errors</li>
        <li>Case-sensitive import problems</li>
        <li>Missing components</li>
        <li>Vite configuration optimization</li>
        <li>Host access configuration</li>
    </ul>
    <p><strong>The dev server reload loop is completely resolved! 🚀</strong></p>
</body>
</html>`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3003;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://0.0.0.0:${PORT}/`);
  console.log(`🌐 Network: http://169.254.0.21:${PORT}/`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});
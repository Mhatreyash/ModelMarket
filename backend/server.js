const http = require('http');

const port = process.env.PORT || 4001;

let payments = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Add CORS headers to all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (method === 'GET' && url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Welcome to ModelMarket Backend\n');
    return;
  }

  if (method === 'GET' && url === '/payments') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ payments }));
    return;
  }

  if (method === 'POST' && url === '/payments') {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const data = JSON.parse(body || '{}');
        const entry = {
          id: payments.length + 1,
          timestamp: new Date().toISOString(),
          ...data,
        };
        payments.push(entry);
        console.log('Received payment record:', entry);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, entry }));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Not found
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, error: 'Not found' }));
});

server.listen(port, () => {
  console.log(`ModelMarket backend running at http://localhost:${port}/`);
});

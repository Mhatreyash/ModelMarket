const http = require('http');

const hostname = '127.0.0.1';
const port = process.env.PORT || 4001;

let payments = [];

const server = http.createServer((req, res) => {
  const { method, url } = req;

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

server.listen(port, hostname, () => {
  console.log(`ModelMarket backend running at http://${hostname}:${port}/`);
});

import http from 'node:http';

export function startMockWebhookServer({ port = 0 } = {}) {
  let mode = 'success'; // 'success' | 'error_500' | 'malformed' | 'slow_hang' | 'empty_json'
  let customResponse = null;
  const requests = [];

  const server = http.createServer((req, res) => {
    // Enable CORS for browser fetch
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    req.on('end', async () => {
      let parsedBody = null;
      try {
        parsedBody = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        parsedBody = rawBody;
      }

      requests.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: parsedBody,
        rawBody,
        timestamp: Date.now()
      });

      if (mode === 'slow_hang') {
        // Delay response past 5s timeout
        setTimeout(() => {
          if (!res.writableEnded) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply: 'Slow delayed response' }));
          }
        }, 10000);
        return;
      }

      if (mode === 'error_500') {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error from Mock AI');
        return;
      }

      if (mode === 'malformed') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<html><head><title>Bad Gateway</title></head><body><h1>502 Bad Gateway</h1></body></html>');
        return;
      }

      if (mode === 'empty_json') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{}');
        return;
      }

      // Default 'success'
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      const payload = customResponse || {
        reply: 'Ответ от внешнего AI-ассистента (тестовый вебхук)',
        crmAction: 'Создана сделка в CRM через n8n вебхук',
        isLive: true
      };
      res.end(JSON.stringify(payload));
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', () => {
      const assignedPort = server.address().port;
      const url = `http://127.0.0.1:${assignedPort}/webhook`;
      resolve({
        port: assignedPort,
        url,
        setMode: (m, custom = null) => {
          mode = m;
          customResponse = custom;
        },
        getRequests: () => [...requests],
        clearRequests: () => {
          requests.length = 0;
        },
        close: () => new Promise((res) => server.close(res))
      });
    });

    server.on('error', reject);
  });
}

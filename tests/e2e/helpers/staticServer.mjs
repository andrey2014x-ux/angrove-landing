import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DIST_DIR = path.resolve(__dirname, '../../../dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

export function startStaticServer({ port = 0, dir = DEFAULT_DIST_DIR } = {}) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      return reject(new Error(`Static directory does not exist: ${dir}`));
    }

    const server = http.createServer((req, res) => {
      try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
        let pathname = decodeURIComponent(parsedUrl.pathname);
        if (pathname === '/' || pathname === '') {
          pathname = '/index.html';
        }

        let filePath = path.join(dir, pathname);

        // Security check: ensure path is within dir
        if (!filePath.startsWith(dir)) {
          res.writeHead(403);
          res.end('Forbidden');
          return;
        }

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        }

        // SPA fallback: if file does not exist, fallback to index.html
        if (!fs.existsSync(filePath)) {
          filePath = path.join(dir, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const stat = fs.statSync(filePath);

        res.writeHead(200, {
          'Content-Type': contentType,
          'Content-Length': stat.size,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });

        const readStream = fs.createReadStream(filePath);
        readStream.pipe(res);
      } catch (err) {
        res.writeHead(500);
        res.end(`Server Error: ${err.message}`);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      const assignedPort = server.address().port;
      const url = `http://127.0.0.1:${assignedPort}`;
      resolve({
        port: assignedPort,
        url,
        server,
        close: () => new Promise((res) => server.close(res))
      });
    });

    server.on('error', reject);
  });
}

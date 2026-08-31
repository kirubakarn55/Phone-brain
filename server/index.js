import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { createAssistantRoute } from './routes/assistant.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || 3000);
const frontendOrigin = String(process.env.FRONTEND_ORIGIN || '').trim();
const assistantRoute = createAssistantRoute({ apiKey: process.env.AI_API_KEY, apiUrl: process.env.AI_API_URL, model: process.env.AI_MODEL });
const publicFiles = new Set(['', '/', '/index.html', '/style.css', '/script.js', '/assistant.js', '/storage.js', '/speech.js', '/device.js', '/memory.js', '/notes.js', '/study.js', '/coding.js', '/gaming.js', '/launcher.js', '/settings.js', '/api.js', '/config.js', '/manifest.json', '/sw.js']);
const contentTypes = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function headers(res, req) {
  if (frontendOrigin && req.headers.origin === frontendOrigin) { res.setHeader('Access-Control-Allow-Origin', frontendOrigin); res.setHeader('Vary', 'Origin'); res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); }
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

const server = http.createServer(async function (req, res) {
  headers(res, req);
  var pathname = new URL(req.url || '/', 'http://localhost').pathname;
  if (req.method === 'OPTIONS' && pathname === '/api/assistant') { res.statusCode = 204; return res.end(); }
  if (req.method === 'POST' && pathname === '/api/assistant') return assistantRoute(req, res);
  if (req.method !== 'GET' || !publicFiles.has(pathname)) { res.statusCode = 404; return res.end('Not found'); }
  var filePath = pathname === '/' ? path.join(root, 'index.html') : path.join(root, pathname.slice(1));
  try { var data = await readFile(filePath); res.statusCode = 200; res.setHeader('Content-Type', contentTypes[path.extname(filePath)] || 'application/octet-stream'); res.end(data); } catch (error) { res.statusCode = 404; res.end('Not found'); }
});

server.listen(port, function () { console.log('Phone Brain backend listening on port ' + port); });
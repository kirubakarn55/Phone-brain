import { getBackendUrl } from './config.js';

const REQUEST_TIMEOUT_MS = 15000;
const MAX_MESSAGE_LENGTH = 4000;

function endpoint() {
  var configured = getBackendUrl();
  if (!configured) return '/api/assistant';
  try {
    var url = new URL(configured);
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && url.hostname === 'localhost')) return null;
    if (url.username || url.password) return null;
    return url.toString().replace(/\/$/, '') + '/api/assistant';
  } catch (error) {
    return null;
  }
}

function offline() { return typeof navigator !== 'undefined' && navigator.onLine === false; }
function failure(kind, message) { return { ok: false, kind: kind, message: message }; }

const ApiClient = {
  requestAssistant: async function (payload) {
    if (offline()) return failure('offline', 'AI is currently unavailable because this device is offline. Local Phone Brain features are still working.');
    var url = endpoint();
    if (!url) return failure('configuration', 'AI backend configuration is invalid. Local Phone Brain features are still working.');
    var message = String(payload && payload.message || '').trim();
    if (!message || message.length > MAX_MESSAGE_LENGTH) return failure('request', 'The AI request must contain between 1 and ' + MAX_MESSAGE_LENGTH + ' characters.');
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timeout = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
    try {
      var request = { message: message, context: payload && payload.context && typeof payload.context === 'object' ? payload.context : {} };
      var fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(request) };
      if (controller) fetchOptions.signal = controller.signal;
      var result = await fetch(url, fetchOptions);
      var text = await result.text();
      var body;
      try { body = JSON.parse(text); } catch (error) { return failure('malformed', 'The AI backend returned malformed data. Local Phone Brain features are still working.'); }
      if (!result.ok) return failure('server', body && body.error ? String(body.error) : 'The AI backend returned an error. Local Phone Brain features are still working.');
      if (!body || typeof body.answer !== 'string' || !body.answer.trim()) return failure('malformed', 'The AI backend returned no usable answer. Local Phone Brain features are still working.');
      return { ok: true, answer: body.answer.trim(), actions: Array.isArray(body.actions) ? body.actions : [] };
    } catch (error) {
      return failure(error && error.name === 'AbortError' ? 'timeout' : 'network', error && error.name === 'AbortError' ? 'The AI request timed out. Local Phone Brain features are still working.' : 'The AI backend is unavailable. Local Phone Brain features are still working.');
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
};

export { ApiClient };
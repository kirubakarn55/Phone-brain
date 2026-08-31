const MAX_BODY_BYTES = 64000;
const MAX_CONTEXT_BYTES = 12000;
const REQUEST_TIMEOUT_MS = 15000;

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise(function (resolve, reject) {
    var chunks = []; var size = 0; var finished = false;
    req.on('data', function (chunk) { if (finished) return; size += chunk.length; if (size > MAX_BODY_BYTES) { finished = true; reject(Object.assign(new Error('Request too large'), { code: 'BODY_TOO_LARGE' })); return; } chunks.push(chunk); });
    req.on('end', function () { if (!finished) resolve(Buffer.concat(chunks).toString('utf8')); });
    req.on('error', function (error) { if (!finished) reject(error); });
  });
}

function safeActions(actions) {
  if (!Array.isArray(actions)) return [];
  return actions.map(function (action) {
    if (!action || typeof action !== 'object' || typeof action.type !== 'string') return null;
    if (action.type === 'open_url' && ['youtube', 'google', 'github'].indexOf(action.target) !== -1) return { type: 'open_url', target: action.target };
    if (action.type === 'create_note' && typeof action.content === 'string' && action.content.trim() && action.content.length <= 1000) return { type: 'create_note', content: action.content.trim() };
    if (action.type === 'set_mode' && ['normal', 'study', 'gaming'].indexOf(action.target) !== -1) return { type: 'set_mode', target: action.target };
    if (action.type === 'start_focus_timer' && Number.isInteger(Number(action.minutes)) && Number(action.minutes) >= 1 && Number(action.minutes) <= 180) return { type: 'start_focus_timer', minutes: Number(action.minutes) };
    return null;
  }).filter(Boolean).slice(0, 3);
}

function providerAnswer(body) {
  if (body && typeof body.answer === 'string') return { answer: body.answer, actions: body.actions };
  var content = body && body.choices && body.choices[0] && body.choices[0].message && body.choices[0].message.content;
  if (Array.isArray(content)) content = content.map(function (part) { return part && part.text ? part.text : ''; }).join('');
  if (typeof content !== 'string') return null;
  var parsed = null;
  try { parsed = JSON.parse(content); } catch (error) { parsed = null; }
  if (parsed && typeof parsed.answer === 'string') return { answer: parsed.answer, actions: parsed.actions };
  return { answer: content, actions: [] };
}

function createAssistantRoute(options) {
  options = options || {};
  var apiKey = String(options.apiKey || '').trim();
  var apiUrl = String(options.apiUrl || 'https://api.openai.com/v1/chat/completions').trim();
  var model = String(options.model || 'gpt-4o-mini').trim();
  return async function (req, res) {
    try {
      var raw = await readBody(req); var input;
      try { input = JSON.parse(raw); } catch (error) { return json(res, 400, { error: 'Request body must be valid JSON.' }); }
      if (!input || typeof input.message !== 'string' || !input.message.trim() || input.message.length > 4000) return json(res, 400, { error: 'message must be a non-empty string of 4000 characters or fewer.' });
      if (input.context !== undefined && (typeof input.context !== 'object' || input.context === null || JSON.stringify(input.context).length > MAX_CONTEXT_BYTES)) return json(res, 400, { error: 'context must be a small JSON object.' });
      if (!apiKey) return json(res, 503, { error: 'AI backend is not configured.' });
      var controller = new AbortController(); var timeout = setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS);
      var providerResponse;
      try {
        providerResponse = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey }, body: JSON.stringify({ model: model, temperature: 0.2, max_tokens: 700, messages: [{ role: 'system', content: 'You are Phone Brain, a concise and truthful assistant. Admit uncertainty. Do not claim to control Android, invent device metrics, execute code, or provide arbitrary browser commands. If an app action is useful, request only one of the documented structured actions: open_url with youtube, google, or github; create_note with content; set_mode with normal, study, or gaming; or start_focus_timer with minutes. Return a JSON object with answer and actions when possible.' }, { role: 'user', content: input.message }], response_format: { type: 'json_object' } }), signal: controller.signal });
      } catch (error) { clearTimeout(timeout); return json(res, error && error.name === 'AbortError' ? 504 : 502, { error: error && error.name === 'AbortError' ? 'AI provider timed out.' : 'AI provider unavailable.' }); }
      clearTimeout(timeout);
      var providerText = await providerResponse.text(); var providerBody;
      try { providerBody = JSON.parse(providerText); } catch (error) { return json(res, 502, { error: 'AI provider returned malformed data.' }); }
      if (!providerResponse.ok) return json(res, 502, { error: 'AI provider returned an error.' });
      var answer = providerAnswer(providerBody);
      if (!answer || typeof answer.answer !== 'string' || !answer.answer.trim()) return json(res, 502, { error: 'AI provider returned no usable answer.' });
      return json(res, 200, { answer: answer.answer.trim(), actions: safeActions(answer.actions) });
    } catch (error) {
      return json(res, error && error.code === 'BODY_TOO_LARGE' ? 413 : 500, { error: error && error.code === 'BODY_TOO_LARGE' ? 'Request body is too large.' : 'Unexpected backend error.' });
    }
  };
}

export { createAssistantRoute };
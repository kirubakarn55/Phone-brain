import { Storage } from './storage.js';
import { Device } from './device.js';

const handlers = {
  setMode: null,
  openUrl: null,
  getStatus: function () { return {}; }
};

function now() {
  return new Date().toISOString();
}

function normalize(text) {
  return text.toLowerCase().replace(/[?!.,]/g, ' ').replace(/\s+/g, ' ').trim();
}

function result(response, intent, data) {
  return Object.assign({ handled: true, intent: intent, response: response }, data || {});
}

function openAllowedUrl(url) {
  if (typeof handlers.openUrl === 'function') {
    return handlers.openUrl(url);
  }
  return false;
}

async function routeCommand(original, normalized) {
  var match;

  match = normalized.match(/^search (?:google|the web) for (.+)$/);
  if (match) {
    var googleUrl = 'https://www.google.com/search?q=' + encodeURIComponent(match[1]);
    openAllowedUrl(googleUrl);
    return result('Opening Google search for ' + match[1] + '.', 'search.google', { url: googleUrl });
  }

  match = normalized.match(/^search youtube for (.+)$/);
  if (match) {
    var youtubeSearchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(match[1]);
    openAllowedUrl(youtubeSearchUrl);
    return result('Opening YouTube search for ' + match[1] + '.', 'search.youtube', { url: youtubeSearchUrl });
  }

  match = normalized.match(/^youtube search(?: for)? (.+)$/);
  if (match) {
    var youtubeUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(match[1]);
    openAllowedUrl(youtubeUrl);
    return result('Opening YouTube search for ' + match[1] + '.', 'search.youtube', { url: youtubeUrl });
  }

  match = normalized.match(/^open (youtube|google|github)(?: website)?$/);
  if (match) {
    var sites = { youtube: 'https://www.youtube.com/', google: 'https://www.google.com/', github: 'https://github.com/' };
    var siteUrl = sites[match[1]];
    openAllowedUrl(siteUrl);
    return result('Opening ' + match[1] + '.', 'open.' + match[1], { url: siteUrl });
  }

  if (normalized === 'what time is it' || normalized === 'what is the time' || normalized === 'time' || normalized === 'clock' || normalized.indexOf('what time') !== -1) {
    return result('The current time is ' + new Date().toLocaleTimeString() + '.', 'time');
  }

  if (normalized.indexOf('battery') !== -1 || normalized.indexOf('power level') !== -1) {
    var battery = await Device.getBatteryStatus();
    if (!battery.supported) return result('Battery status: Unavailable in this browser.', 'battery', { supported: false });
    var chargingText = battery.charging ? ' It is charging.' : '';
    return result('Battery is at ' + Math.round(battery.level) + '%.' + chargingText, 'battery', { supported: true, level: battery.level });
  }

  if (normalized.indexOf('cpu') !== -1 || normalized.indexOf('processor') !== -1 || normalized.indexOf('ram') !== -1 || normalized.indexOf('memory usage') !== -1) {
    return result('CPU and RAM usage: Unavailable in this browser. The browser does not expose reliable system usage metrics.', 'system-metrics', { supported: false });
  }

  if (normalized.indexOf('gaming') !== -1 || normalized === 'game mode' || normalized === 'game') {
    if (typeof handlers.setMode === 'function') handlers.setMode('gaming');
    return result('Gaming mode selected. Phone Brain will only use supported browser features.', 'mode.gaming');
  }

  if (normalized.indexOf('study') !== -1 || normalized.indexOf('focus mode') !== -1 || normalized === 'focus') {
    if (typeof handlers.setMode === 'function') handlers.setMode('study');
    return result('Study mode selected.', 'mode.study');
  }

  if (normalized === 'normal mode' || normalized === 'normal' || normalized === 'reset mode' || normalized === 'reset') {
    if (typeof handlers.setMode === 'function') handlers.setMode('normal');
    return result('Normal mode restored.', 'mode.normal');
  }

  if (normalized === 'status' || normalized === 'system status' || normalized.indexOf('system status') !== -1) {
    var status = handlers.getStatus() || {};
    var batteryText = status.battery === null || typeof status.battery === 'undefined' ? 'Unavailable in this browser' : Math.round(status.battery) + '%';
    return result('System status: Battery ' + batteryText + ', CPU Unavailable in this browser, RAM Unavailable in this browser, mode ' + (status.mode || 'normal') + '.', 'status', { status: status });
  }

  match = normalized.match(/^remember (.+)$/);
  if (match) {
    var memory = Storage.addMemory(match[1]);
    return result('I saved that memory locally on this device.', 'memory.add', { memory: memory });
  }

  if (normalized === 'clear memory' || normalized === 'forget all memories') {
    Storage.clearMemory();
    return result('Local memory cleared.', 'memory.clear');
  }

  if (normalized === 'hello' || normalized === 'hi' || normalized === 'hey') {
    return result('Hello. Phone Brain is ready.', 'greeting');
  }

  if (normalized === 'help' || normalized === 'what can you do') {
    return result('Try time, battery, start gaming mode, start study mode, normal mode, open YouTube, search Google for Python, or search YouTube for SQL tutorial.', 'help');
  }

  return result('I do not recognize that command yet. Try saying help for supported commands.', 'unknown', { original: original });
}

const Assistant = {
  configure: function (options) { Object.assign(handlers, options || {}); },
  processCommand: async function (text) {
    var original = String(text || '').trim();
    if (!original) return result('Please enter a command.', 'empty');
    var normalized = normalize(original);
    Storage.appendHistory({ role: 'user', content: original, timestamp: now() });
    var response;
    try {
      response = await routeCommand(original, normalized);
    } catch (error) {
      response = result('I could not complete that command. Please try again.', 'error');
    }
    Storage.appendHistory({ role: 'assistant', content: response.response, timestamp: now(), intent: response.intent });
    return response;
  }
};

export { Assistant };
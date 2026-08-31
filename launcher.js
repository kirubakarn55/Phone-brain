import { Storage } from './storage.js';
const BUILT_INS = Object.freeze({ youtube: 'https://www.youtube.com/', google: 'https://www.google.com/', github: 'https://github.com/' });
function safeUrl(value) { try { var url = new URL(String(value)); if (url.protocol !== 'https:' || url.username || url.password) return null; return url.toString(); } catch (error) { return null; } }
function open(url) { var safe = safeUrl(url); if (!safe) return { opened: false, message: 'That is not an allowed HTTPS shortcut.' }; var popup = window.open(safe, '_blank', 'noopener,noreferrer'); return popup ? { opened: true, url: safe } : { opened: false, message: 'The browser blocked the new tab.' }; }
const Launcher = {
  builtIns: function () { return BUILT_INS; }, validateUrl: safeUrl,
  openBuiltIn: function (name) { var url = BUILT_INS[String(name || '').toLowerCase()]; return url ? open(url) : { opened: false, message: 'Shortcut not found.' }; },
  searchGoogle: function (query) { return open('https://www.google.com/search?q=' + encodeURIComponent(String(query || ''))); },
  searchYouTube: function (query) { return open('https://www.youtube.com/results?search_query=' + encodeURIComponent(String(query || ''))); },
  openUrl: open, listShortcuts: function () { return Storage.load('launcher'); },
  addShortcut: function (name, url) { var label = String(name || '').trim(); var safe = safeUrl(url); if (!label || !safe) return { saved: false, message: 'Add a name and a valid HTTPS URL.' }; var shortcuts = Storage.load('launcher'); var shortcut = { id: 'shortcut-' + Date.now(), name: label, url: safe }; shortcuts.push(shortcut); Storage.save('launcher', shortcuts); return { saved: true, shortcut: shortcut, message: 'Shortcut saved.' }; },
  removeShortcut: function (id) { var shortcuts = Storage.load('launcher'); var remaining = shortcuts.filter(function (shortcut) { return shortcut.id !== id; }); Storage.save('launcher', remaining); return { removed: shortcuts.length !== remaining.length, message: shortcuts.length !== remaining.length ? 'Shortcut removed.' : 'Shortcut not found.' }; }
};
export { Launcher };
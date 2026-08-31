import { Storage } from './storage.js';
import { Notes } from './notes.js';
import { Launcher } from './launcher.js';
let timer = null; let timerEndsAt = 0;
const Gaming = {
  listFavorites: function () { return Storage.load('gaming').favorites || []; },
  addFavorite: function (name, url) { var safe = Launcher.validateUrl(url); var label = String(name || '').trim(); if (!label || !safe) return { saved: false, message: 'Add a name and a valid HTTPS URL.' }; var data = Storage.load('gaming'); data.favorites = data.favorites || []; var favorite = { id: 'favorite-' + Date.now(), name: label, url: safe }; data.favorites.push(favorite); Storage.save('gaming', data); return { saved: true, favorite: favorite, message: 'Gaming favorite saved.' }; },
  removeFavorite: function (id) { var data = Storage.load('gaming'); var favorites = data.favorites || []; data.favorites = favorites.filter(function (favorite) { return favorite.id !== id; }); Storage.save('gaming', data); return { removed: favorites.length !== data.favorites.length, message: favorites.length !== data.favorites.length ? 'Gaming favorite removed.' : 'Favorite not found.' }; },
  addNote: function (text) { return Notes.create({ title: 'Gaming note', content: text, category: 'gaming' }); },
  startTimer: function (minutes, callbacks) { callbacks = callbacks || {}; Gaming.stopTimer(); var duration = Math.max(1, Math.min(240, Number(minutes) || 60)) * 60; timerEndsAt = Date.now() + duration * 1000; var tick = function () { var remaining = Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000)); if (typeof callbacks.onTick === 'function') callbacks.onTick(remaining); if (remaining <= 0) { Gaming.stopTimer(); if (typeof callbacks.onComplete === 'function') callbacks.onComplete(); } }; timer = setInterval(tick, 1000); tick(); return { started: true, seconds: duration }; },
  stopTimer: function () { if (timer) clearInterval(timer); timer = null; timerEndsAt = 0; }, isTimerRunning: function () { return Boolean(timer); }
};
export { Gaming };
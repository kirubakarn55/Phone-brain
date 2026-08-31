import { Storage } from './storage.js';
const Settings = {
  defaults: function () { return Storage.loadSettings(); }, get: function () { return Storage.loadSettings(); },
  save: function (changes) { var current = Storage.loadSettings(); var next = Object.assign({}, current, changes || {}); next.speechRate = Math.max(0.5, Math.min(2, Number(next.speechRate) || 1)); Storage.saveSettings(next); Settings.apply(next); return next; },
  apply: function (settings) { var value = settings || Storage.loadSettings(); if (typeof document !== 'undefined') document.body.classList.toggle('reduced-motion', Boolean(value.reducedAnimations)); return value; },
  clearHistory: function () { return Storage.clearHistory(); }, clearMemory: function () { return Storage.clearMemory(); }, clearNotes: function () { return Storage.clearNotes(); }
};
export { Settings };
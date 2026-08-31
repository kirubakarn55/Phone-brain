import { Storage } from './storage.js';
const SECRET_PATTERNS = [/password/i, /passcode/i, /api[ _-]?key/i, /access[ _-]?token/i, /secret/i, /private[ _-]?key/i, /credential/i];
function isSensitive(text) { return SECRET_PATTERNS.some(function (pattern) { return pattern.test(text); }); }
function clean(text) { return String(text || '').trim(); }
const Memory = {
  add: function (text) {
    var value = clean(text);
    if (!value) return { saved: false, message: 'Please provide a memory to save.' };
    if (isSensitive(value)) return { saved: false, message: 'I will not store passwords, API keys, tokens, secrets, or credentials.' };
    var memory = Storage.addMemory(value);
    return { saved: true, memory: memory, message: 'Memory saved locally on this device.' };
  },
  list: function () { return Storage.loadMemories().slice().sort(function (a, b) { return String(b.createdAt).localeCompare(String(a.createdAt)); }); },
  forget: function (query) {
    var value = clean(query).toLowerCase();
    if (!value) return { removed: 0, message: 'Tell me which memory to forget.' };
    var memories = Storage.loadMemories();
    var remaining = memories.filter(function (memory) { return String(memory.text).toLowerCase().indexOf(value) === -1; });
    var removed = memories.length - remaining.length;
    Storage.save('memories', remaining);
    return { removed: removed, message: removed ? 'Removed ' + removed + ' matching memor' + (removed === 1 ? 'y.' : 'ies.') : 'I could not find a matching memory.' };
  },
  clear: function () { Storage.clearMemory(); return { cleared: true, message: 'All local memories cleared.' }; }
};
export { Memory };
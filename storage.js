const VERSION = 'v1';
const PREFIX = 'phone-brain:' + VERSION + ':';
const SLOT_KEYS = Object.freeze({ settings: PREFIX + 'settings', memories: PREFIX + 'memories', notes: PREFIX + 'notes', history: PREFIX + 'history', studyProgress: PREFIX + 'study-progress' });
const DEFAULTS = Object.freeze({
  settings: { voiceEnabled: false, speechRate: 1, assistantName: 'Phone Brain', userName: '', reducedAnimations: false },
  memories: [], notes: [], history: [], studyProgress: { completed: 0, quizzes: 0, focusMinutes: 0 }
});

function fallbackFor(name) {
  var value = DEFAULTS[name];
  return Array.isArray(value) ? [] : Object.assign({}, value);
}

function keyFor(name) {
  if (!Object.prototype.hasOwnProperty.call(SLOT_KEYS, name)) throw new Error('Unknown Phone Brain storage slot');
  return SLOT_KEYS[name];
}

function load(name, fallback) {
  var defaultValue = typeof fallback === 'undefined' ? fallbackFor(name) : fallback;
  try {
    var raw = localStorage.getItem(keyFor(name));
    return raw === null ? defaultValue : JSON.parse(raw);
  } catch (error) {
    return defaultValue;
  }
}

function save(name, value) {
  try {
    localStorage.setItem(keyFor(name), JSON.stringify(value));
    return true;
  } catch (error) {
    return false;
  }
}

function clear(name) {
  try {
    localStorage.removeItem(keyFor(name));
    return true;
  } catch (error) {
    return false;
  }
}

const Storage = {
  load: load,
  save: save,
  loadSettings: function () { return load('settings'); },
  saveSettings: function (settings) { return save('settings', settings); },
  loadMemories: function () { return load('memories'); },
  addMemory: function (text) {
    var memory = { id: 'memory-' + Date.now(), text: String(text), createdAt: new Date().toISOString() };
    var memories = load('memories');
    memories.push(memory);
    save('memories', memories);
    return memory;
  },
  clearMemory: function () { return clear('memories'); },
  loadNotes: function () { return load('notes'); },
  saveNotes: function (notes) { return save('notes', notes); },
  clearNotes: function () { return clear('notes'); },
  loadHistory: function () { return load('history'); },
  saveHistory: function (history) { return save('history', history.slice(-100)); },
  appendHistory: function (message) {
    var history = load('history');
    history.push(message);
    save('history', history.slice(-100));
  },
  clearHistory: function () { return clear('history'); },
  loadStudyProgress: function () { return load('studyProgress'); },
  saveStudyProgress: function (progress) { return save('studyProgress', progress); }
};

export { Storage, VERSION };
import { Storage } from './storage.js';
function clean(text) { return String(text || '').trim(); }
function makeId() { return 'note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8); }
const Notes = {
  list: function (query, category) {
    var search = clean(query).toLowerCase();
    return Storage.loadNotes().filter(function (note) { return (!category || note.category === category) && (!search || [note.title, note.content, note.category].join(' ').toLowerCase().indexOf(search) !== -1); }).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
  },
  create: function (data) {
    data = data || {};
    var title = clean(data.title) || 'Untitled note';
    var content = clean(data.content);
    if (!content) return { saved: false, message: 'Please provide note content.' };
    var timestamp = new Date().toISOString();
    var note = { id: makeId(), title: title, content: content, category: data.category || 'general', createdAt: timestamp, updatedAt: timestamp };
    var notes = Storage.loadNotes(); notes.push(note); Storage.saveNotes(notes);
    return { saved: true, note: note, message: 'Note saved locally.' };
  },
  update: function (id, data) {
    var notes = Storage.loadNotes(); var index = notes.findIndex(function (note) { return note.id === id; });
    if (index === -1) return { saved: false, message: 'Note not found.' };
    var content = clean(data && data.content); if (!content) return { saved: false, message: 'Note content cannot be empty.' };
    notes[index] = Object.assign({}, notes[index], { title: clean(data.title) || notes[index].title, content: content, updatedAt: new Date().toISOString() }); Storage.saveNotes(notes);
    return { saved: true, note: notes[index], message: 'Note updated.' };
  },
  remove: function (id) { var notes = Storage.loadNotes(); var remaining = notes.filter(function (note) { return note.id !== id; }); Storage.saveNotes(remaining); return { removed: notes.length !== remaining.length, message: notes.length !== remaining.length ? 'Note deleted.' : 'Note not found.' }; },
  removeByQuery: function (query) { var search = clean(query).toLowerCase(); if (!search) return { removed: false, message: 'Tell me which note to delete.' }; var notes = Storage.loadNotes(); var match = notes.find(function (note) { return [note.id, note.title, note.content].join(' ').toLowerCase().indexOf(search) !== -1; }); return match ? Notes.remove(match.id) : { removed: false, message: 'I could not find a matching note.' }; },
  clear: function () { Storage.clearNotes(); return { cleared: true, message: 'All local notes cleared.' }; }
};
export { Notes };
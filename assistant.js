import { Storage } from './storage.js';
import { Device } from './device.js';
import { Memory } from './memory.js';
import { Notes } from './notes.js';
import { Study } from './study.js';
import { Coding } from './coding.js';
import { Gaming } from './gaming.js';
import { Launcher } from './launcher.js';
import { Settings } from './settings.js';
import { ApiClient } from './api.js';

const handlers = { setMode: null, getStatus: function () { return {}; } };
function now() { return new Date().toISOString(); }
function normalize(text) { return text.toLowerCase().replace(/[?!.,]/g, ' ').replace(/\s+/g, ' ').trim(); }
function response(message, intent, data) { return Object.assign({ handled: true, intent: intent, response: message }, data || {}); }
function listText(items, emptyText, formatter) { return items.length ? items.map(formatter).join(' ') : emptyText; }
function formatQuestion(question) { return question.question + ' Options: ' + question.options.map(function (option, index) { return index + 1 + ') ' + option; }).join(', ') + '.'; }


function buildAIContext(normalized) {
  var settings = Settings.get(); var status = handlers.getStatus() || {};
  var context = { mode: status.mode || 'normal', userName: settings.userName || '' };
  if (normalized.indexOf('study') !== -1 || normalized.indexOf('quiz') !== -1 || normalized.indexOf('learn') !== -1) context.studyProgress = Study.getProgress();
  return context;
}
function applySafeAction(action) {
  if (!action || typeof action !== 'object') return { applied: false };
  if (action.type === 'open_url' && ['youtube', 'google', 'github'].indexOf(action.target) !== -1) { var opened = Launcher.openBuiltIn(action.target); return { applied: opened.opened, message: opened.message || '' }; }
  if (action.type === 'create_note' && typeof action.content === 'string' && action.content.trim().length <= 1000) { var note = Notes.create({ title: 'AI note', content: action.content }); return { applied: note.saved, message: note.message }; }
  if (action.type === 'set_mode' && ['normal', 'study', 'gaming'].indexOf(action.target) !== -1) { if (typeof handlers.setMode === 'function') handlers.setMode(action.target); return { applied: true }; }
  if (action.type === 'start_focus_timer' && Number.isInteger(Number(action.minutes)) && Number(action.minutes) >= 1 && Number(action.minutes) <= 180) { Study.startFocusTimer(Number(action.minutes)); return { applied: true }; }
  return { applied: false };
}

async function routeCommand(original, normalized) {
  var match;
  match = normalized.match(/^search (?:google|the web) for (.+)$/);
  if (match) { var google = Launcher.searchGoogle(match[1]); return response(google.opened ? 'Opening Google search for ' + match[1] + '.' : google.message, 'search.google', { url: google.url }); }
  match = normalized.match(/^search youtube for (.+)$/) || normalized.match(/^youtube search(?: for)? (.+)$/);
  if (match) { var youtube = Launcher.searchYouTube(match[1]); return response(youtube.opened ? 'Opening YouTube search for ' + match[1] + '.' : youtube.message, 'search.youtube', { url: youtube.url }); }
  match = normalized.match(/^open (youtube|google|github)(?: website)?$/);
  if (match) { var site = Launcher.openBuiltIn(match[1]); return response(site.opened ? 'Opening ' + match[1] + '.' : site.message, 'open.' + match[1], { url: site.url }); }

  if (normalized.indexOf('what do you remember') !== -1 || normalized === 'show my memories' || normalized === 'show memories') { var memories = Memory.list(); return response(listText(memories, 'I have no saved memories.', function (item) { return item.text + '.'; }), 'memory.list', { memories: memories }); }
  match = original.match(/^remember(?: that)? (.+)$/i);
  if (match) { var savedMemory = Memory.add(match[1]); return response(savedMemory.message, 'memory.add', { memory: savedMemory.memory, saved: savedMemory.saved }); }
  if (normalized === 'clear memory' || normalized === 'clear memories') { var clearedMemory = Memory.clear(); return response(clearedMemory.message, 'memory.clear'); }
  match = original.match(/^forget (.+)$/i);
  if (match) { var forgotten = Memory.forget(match[1]); return response(forgotten.message, 'memory.forget', { removed: forgotten.removed }); }

  match = original.match(/^(?:create (?:a )?note|save this as a note|take a note)[: ]+(.+)$/i);
  if (match) { var createdNote = Notes.create({ title: 'Quick note', content: match[1] }); return response(createdNote.message, 'note.create', { note: createdNote.note, saved: createdNote.saved }); }
  if (normalized === 'show my notes' || normalized === 'list my notes') { var notes = Notes.list(); return response(listText(notes, 'You have no saved notes.', function (note) { return note.title + ': ' + note.content + '.'; }), 'note.list', { notes: notes }); }
  match = original.match(/^search my notes for (.+)$/i);
  if (match) { var foundNotes = Notes.list(match[1]); return response(listText(foundNotes, 'No matching notes found.', function (note) { return note.title + ': ' + note.content + '.'; }), 'note.search', { notes: foundNotes }); }
  match = original.match(/^delete my note (.+)$/i);
  if (match) { var deletedNote = Notes.removeByQuery(match[1]); return response(deletedNote.message, 'note.delete', { removed: deletedNote.removed }); }
  if (normalized === 'clear notes') { var clearedNotes = Notes.clear(); return response(clearedNotes.message, 'note.clear'); }

  if (normalized.indexOf('quiz me') !== -1 || normalized.indexOf('start a quiz') !== -1) { var quiz = Study.nextQuestion(normalized); return response(formatQuestion(quiz), 'study.quiz', { question: quiz }); }
  match = normalized.match(/^explain (python|sql|data analytics)(.*)$/) || normalized.match(/^explain (.+) in (python|sql|data analytics)$/);
  if (match) { var studyTopic = match[1] + (match[2] || ''); if (/(function|variable|indent|join|select|where|group|median|mean|clean)/.test(studyTopic)) { var explanation = Study.explain(studyTopic); return response(explanation.response, 'study.explain', { offline: true }); } return { askAI: true }; }
  if (normalized.indexOf('study progress') !== -1 || normalized === 'my progress') { var progress = Study.getProgress(); return response('Study progress: ' + progress.completed + ' explanations completed, ' + progress.quizzes + ' quiz attempts, and ' + progress.focusMinutes + ' focus minutes.', 'study.progress', { progress: progress }); }
  match = normalized.match(/^focus timer(?: for)? (\d+) minutes?$/);
  if (match) { Study.startFocusTimer(Number(match[1])); return response('Focus timer started for ' + match[1] + ' minutes.', 'study.timer'); }

  if (normalized.indexOf('explain code') === 0 || normalized.indexOf('find likely errors') === 0 || normalized.indexOf('debug code') === 0 || normalized.indexOf('why does this code') === 0) return { askAI: true };
  if (normalized.indexOf('python concept') !== -1 || normalized.indexOf('sql concept') !== -1) { var concept = Study.explain(normalized); return response(concept.response, 'coding.concept', { offline: true }); }

  match = normalized.match(/^gaming timer(?: for)? (\d+) minutes?$/);
  if (match) { Gaming.startTimer(Number(match[1])); return response('Gaming timer started for ' + match[1] + ' minutes. No CPU or GPU boost was performed.', 'gaming.timer'); }
  match = original.match(/^gaming note (.+)$/i);
  if (match) { var gamingNote = Gaming.addNote(match[1]); return response(gamingNote.message, 'gaming.note'); }

  if (normalized === 'voice on' || normalized === 'enable voice') { Settings.save({ voiceEnabled: true }); return response('Assistant voice responses enabled.', 'settings.voice'); }
  if (normalized === 'voice off' || normalized === 'disable voice') { Settings.save({ voiceEnabled: false }); return response('Assistant voice responses disabled.', 'settings.voice'); }
  match = normalized.match(/^set speech rate to ([0-9.]+)$/);
  if (match) { Settings.save({ speechRate: Number(match[1]) }); return response('Speech rate saved.', 'settings.speech-rate'); }
  match = original.match(/^set assistant name to (.+)$/i);
  if (match) { Settings.save({ assistantName: match[1] }); return response('Assistant name saved.', 'settings.assistant-name'); }
  match = original.match(/^set user name to (.+)$/i);
  if (match) { Settings.save({ userName: match[1] }); return response('User name saved.', 'settings.user-name'); }
  if (normalized === 'clear history') { Storage.clearHistory(); return response('Conversation history cleared.', 'history.clear'); }

  if (normalized === 'what time is it' || normalized === 'what is the time' || normalized === 'time' || normalized === 'clock' || normalized.indexOf('what time') !== -1) return response('The current time is ' + new Date().toLocaleTimeString() + '.', 'time');
  if (normalized.indexOf('battery') !== -1 || normalized.indexOf('power level') !== -1) { var battery = await Device.getBatteryStatus(); return battery.supported ? response('Battery is at ' + Math.round(battery.level) + '%' + (battery.charging ? '. It is charging.' : '.'), 'battery', { level: battery.level }) : response('Battery status: Unavailable in this browser.', 'battery', { supported: false }); }
  if (normalized.indexOf('cpu') !== -1 || normalized.indexOf('processor') !== -1 || normalized.indexOf('ram') !== -1 || normalized.indexOf('memory usage') !== -1) return response('CPU and RAM usage: Unavailable in this browser. Reliable system usage metrics are not exposed to normal web pages.', 'system-metrics', { supported: false });
  if (normalized.indexOf('gaming') !== -1 || normalized === 'game mode' || normalized === 'game') { if (typeof handlers.setMode === 'function') handlers.setMode('gaming'); return response('Gaming mode selected. No CPU or GPU boost was performed.', 'mode.gaming'); }
  if (normalized.indexOf('study') !== -1 || normalized.indexOf('focus mode') !== -1 || normalized === 'focus') { if (typeof handlers.setMode === 'function') handlers.setMode('study'); return response('Study mode selected.', 'mode.study'); }
  if (normalized === 'normal mode' || normalized === 'normal' || normalized === 'reset mode' || normalized === 'reset') { if (typeof handlers.setMode === 'function') handlers.setMode('normal'); return response('Normal mode restored.', 'mode.normal'); }
  if (normalized === 'status' || normalized === 'system status' || normalized.indexOf('system status') !== -1) { var status = handlers.getStatus() || {}; return response('System status: Battery ' + (status.battery === null || typeof status.battery === 'undefined' ? 'Unavailable in this browser' : Math.round(status.battery) + '%') + ', CPU Unavailable in this browser, RAM Unavailable in this browser, mode ' + (status.mode || 'normal') + '.', 'status', { status: status }); }
  if (normalized === 'hello' || normalized === 'hi' || normalized === 'hey') return response('Hello. Phone Brain is ready.', 'greeting');
  if (normalized === 'help' || normalized === 'what can you do') return response('Try memories, notes, study explanations, quizzes, focus timers, Coding Mode, gaming timers, open YouTube, search Google, or settings commands.', 'help');
  return { askAI: true };
}

const Assistant = {
  configure: function (options) { Object.assign(handlers, options || {}); },
  processCommand: async function (text) {
    var original = String(text || '').trim();
    if (!original) return response('Please enter a command.', 'empty');
    Storage.appendHistory({ role: 'user', content: original, timestamp: now() });
    var output;
    try {
      output = await routeCommand(original, normalize(original));
      if (output && output.askAI) {
        var ai = await ApiClient.requestAssistant({ message: original, context: buildAIContext(normalize(original)) });
        if (ai.ok) {
          var applied = (ai.actions || []).map(applySafeAction).filter(function (item) { return item.applied; });
          output = response(ai.answer, 'ai.response', { aiAvailable: true, actions: applied });
        } else {
          output = response(ai.message || 'AI is currently unavailable. Local Phone Brain features are still working.', 'ai.unavailable', { aiAvailable: false, reason: ai.kind });
        }
      }
    } catch (error) {
      output = response('I could not complete that command. Local Phone Brain features are still working.', 'error', { aiAvailable: false });
    }
    Storage.appendHistory({ role: 'assistant', content: output.response, timestamp: now(), intent: output.intent });
    return output;
  }
};
export { Assistant };
function recognitionConstructor() {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function unsupported() {
  return { supported: false, message: 'Unavailable in this browser' };
}

let recognition = null;
let listening = false;

const Speech = {
  isRecognitionSupported: function () { return Boolean(recognitionConstructor()); },
  isSynthesisSupported: function () { return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function'; },
  isListening: function () { return listening; },
  startListening: function (callbacks) {
    callbacks = callbacks || {};
    var Constructor = recognitionConstructor();
    if (!Constructor) {
      if (typeof callbacks.onError === 'function') callbacks.onError('Unavailable in this browser');
      return unsupported();
    }
    if (listening) return { supported: true, active: true };
    recognition = new Constructor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = callbacks.lang || 'en-US';
    recognition.onstart = function () {
      listening = true;
      if (typeof callbacks.onStart === 'function') callbacks.onStart();
    };
    recognition.onresult = function (event) {
      var transcript = event.results && event.results[0] && event.results[0][0] ? event.results[0][0].transcript.trim() : '';
      if (transcript && typeof callbacks.onText === 'function') callbacks.onText(transcript);
    };
    recognition.onerror = function (event) {
      var message = event && event.error ? 'Speech recognition error: ' + event.error : 'Speech recognition failed.';
      if (typeof callbacks.onError === 'function') callbacks.onError(message);
    };
    recognition.onend = function () {
      listening = false;
      recognition = null;
      if (typeof callbacks.onEnd === 'function') callbacks.onEnd();
    };
    try {
      recognition.start();
      return { supported: true, active: true };
    } catch (error) {
      listening = false;
      recognition = null;
      if (typeof callbacks.onError === 'function') callbacks.onError('Speech recognition could not start.');
      return { supported: true, active: false };
    }
  },
  stopListening: function () {
    if (recognition) {
      try { recognition.stop(); } catch (error) {}
    }
    listening = false;
  },
  speak: function (text, rate) {
    if (!Speech.isSynthesisSupported()) return unsupported();
    var utterance = new window.SpeechSynthesisUtterance(String(text));
    utterance.rate = Math.max(0.5, Math.min(2, Number(rate) || 1));
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return { supported: true };
  }
};

export { Speech };
import { Assistant } from './assistant.js';
import { Storage } from './storage.js';
import { Speech } from './speech.js';
import { Device } from './device.js';

let batteryLevel = null;
let currentMode = 'normal';
let voiceActive = false;
let chatVisible = false;

Assistant.configure({ setMode: setMode, openUrl: openSafeUrl, getStatus: getDashboardState });

document.addEventListener('DOMContentLoaded', function () {
  initClock();
  initBattery();
  initCpuRam();
  initModes();
  initVoice();
  initAssistant();
  initAiOrb();
  initParticles();
  initNetworkStatus();
  initPWA();
  addLog('System initialized');
  addLog('Neural core online');
  addLog('Browser capability scan complete');
});

function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  var now = new Date();
  var h = String(now.getHours()).padStart(2, '0');
  var m = String(now.getMinutes()).padStart(2, '0');
  var s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock-time').textContent = h + ':' + m + ':' + s;
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  document.getElementById('clock-date').textContent = days[now.getDay()] + ' ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  document.getElementById('seconds-fill').style.width = ((now.getSeconds() / 59) * 100).toFixed(1) + '%';
}

async function initBattery() {
  var status = await Device.getBatteryStatus();
  updateBattery(status);
  await Device.watchBattery(updateBattery);
}

function updateBattery(status) {
  var value = document.getElementById('battery-val');
  var fill = document.getElementById('battery-fill');
  if (!status || !status.supported) {
    batteryLevel = null;
    value.textContent = 'N/A';
    value.title = 'Unavailable in this browser';
    fill.style.width = '0%';
    fill.title = 'Unavailable in this browser';
    return;
  }
  batteryLevel = status.level;
  value.textContent = Math.round(status.level) + '%';
  value.title = status.charging ? 'Charging' : 'Battery level';
  fill.style.width = Math.max(0, Math.min(100, status.level)) + '%';
}

function initCpuRam() { updateCpuRam(); }

function updateCpuRam() {
  var cpu = document.getElementById('cpu-val');
  var ram = document.getElementById('ram-val');
  cpu.textContent = 'N/A';
  ram.textContent = 'N/A';
  cpu.title = 'Unavailable in this browser';
  ram.title = 'Unavailable in this browser';
  document.getElementById('cpu-fill').style.width = '0%';
  document.getElementById('ram-fill').style.width = '0%';
}

function initModes() {
  document.getElementById('gaming-btn').addEventListener('click', function () { setMode('gaming'); });
  document.getElementById('study-btn').addEventListener('click', function () { setMode('study'); });
}

function setMode(mode) {
  if (mode === currentMode) return;
  if (mode === 'normal') {
    if (currentMode !== 'normal') toggleMode(currentMode);
    return;
  }
  if (mode === 'gaming' || mode === 'study') toggleMode(mode);
}

function toggleMode(mode) {
  var statusEl = document.getElementById('mode-status');
  var gamingBtn = document.getElementById('gaming-btn');
  var studyBtn = document.getElementById('study-btn');
  if (currentMode === mode) {
    currentMode = 'normal';
    gamingBtn.classList.remove('active');
    studyBtn.classList.remove('active');
    statusEl.className = 'mode-status';
    statusEl.textContent = '';
    showToast('Mode: Normal');
    addLog('Returned to normal mode');
  } else {
    currentMode = mode;
    gamingBtn.classList.toggle('active', mode === 'gaming');
    studyBtn.classList.toggle('active', mode === 'study');
    if (mode === 'gaming') {
      statusEl.className = 'mode-status gaming-active';
      statusEl.textContent = 'Gaming Mode Active';
      showToast('Gaming Mode ON');
      addLog('Gaming mode selected');
    } else {
      statusEl.className = 'mode-status study-active';
      statusEl.textContent = 'Study Mode Active';
      showToast('Study Mode ON');
      addLog('Study mode selected');
    }
  }
  document.getElementById('mode-val').textContent = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
  document.getElementById('status-mode').textContent = 'Mode: ' + currentMode;
}

function initVoice() {
  document.getElementById('voice-btn').addEventListener('click', toggleVoice);
  document.getElementById('assistant-voice-btn').addEventListener('click', toggleVoice);
}

function setVoiceButtonState(active) {
  voiceActive = active;
  document.getElementById('voice-btn').classList.toggle('active', active);
  document.getElementById('assistant-voice-btn').classList.toggle('active', active);
  document.querySelector('.ai-orb').classList.toggle('listening', active);
}

function toggleVoice() {
  if (Speech.isListening()) {
    stopVoice();
    return;
  }
  var status = Speech.startListening({
    onStart: function () {
      setVoiceButtonState(true);
      addAiMessage('Listening...', 'system');
      addLog('Voice input active');
    },
    onText: function (text) {
      addAiMessage(text, 'user');
      handleVoiceCommand(text);
    },
    onError: function (message) {
      showToast(message);
      addLog(message);
    },
    onEnd: function () { setVoiceButtonState(false); }
  });
  if (!status.supported) showToast(status.message);
}

function stopVoice() {
  Speech.stopListening();
  setVoiceButtonState(false);
}

function handleVoiceCommand(text) { return runAssistantCommand(text); }

function initAssistant() {
  renderConversation();
  document.getElementById('assistant-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var input = document.getElementById('assistant-input');
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    runAssistantCommand(text);
  });
  document.getElementById('clear-history-btn').addEventListener('click', function () {
    Storage.clearHistory();
    renderConversation();
    addAiMessage('Conversation history cleared.', 'system');
    showToast('History cleared');
  });
}

async function runAssistantCommand(text) {
  var response = await Assistant.processCommand(text);
  renderConversation();
  if (response && response.response) {
    var settings = Storage.loadSettings();
    if (settings.voiceEnabled) Speech.speak(response.response, settings.speechRate);
  }
  return response;
}

function renderConversation() {
  var history = Storage.loadHistory();
  var panel = document.getElementById('assistant-conversation');
  var orbChat = document.getElementById('ai-chat');
  panel.textContent = '';
  orbChat.textContent = '';
  history.forEach(function (message) {
    var className = 'ai-msg ' + (message.role === 'user' ? 'user-msg' : '');
    var panelMessage = document.createElement('div');
    panelMessage.className = className;
    panelMessage.textContent = message.content;
    panel.appendChild(panelMessage);
    orbChat.appendChild(panelMessage.cloneNode(true));
  });
  panel.scrollTop = panel.scrollHeight;
  orbChat.scrollTop = orbChat.scrollHeight;
}

function initAiOrb() {
  var orb = document.querySelector('.ai-orb');
  orb.addEventListener('click', function () {
    chatVisible = !chatVisible;
    document.getElementById('ai-chat').classList.toggle('visible', chatVisible);
    if (chatVisible) {
      renderConversation();
      if (Storage.loadHistory().length === 0) addAiMessage('Phone Brain AI online. How can I assist you?', 'ai');
    }
  });
}

function addAiMessage(text, type) {
  var chat = document.getElementById('ai-chat');
  var message = document.createElement('div');
  message.className = 'ai-msg ' + (type === 'user' ? 'user-msg' : type === 'system' ? 'system-msg' : '');
  message.textContent = text;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
  while (chat.children.length > 8) chat.removeChild(chat.firstChild);
}

function getDashboardState() { return { battery: batteryLevel, cpu: null, ram: null, mode: currentMode }; }

function openSafeUrl(url) {
  try {
    var parsed = new URL(url);
    var allowedHosts = ['www.youtube.com', 'youtube.com', 'www.google.com', 'google.com', 'github.com', 'www.github.com'];
    if (parsed.protocol !== 'https:' || allowedHosts.indexOf(parsed.hostname) === -1) return false;
    var opened = window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
    return opened !== null;
  } catch (error) {
    return false;
  }
}

function initNetworkStatus() {
  var update = function (status) {
    var label = document.getElementById('connection-status');
    var dot = document.getElementById('status-dot');
    if (!status.supported) {
      label.textContent = 'Unavailable';
      return;
    }
    label.textContent = status.online ? 'Online' : 'Offline';
    dot.classList.toggle('offline', !status.online);
  };
  update(Device.getOnlineStatus());
  Device.onConnectivityChange(update);
}

function initParticles() {
  for (var i = 0; i < 15; i += 1) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = 6 + Math.random() * 8 + 's';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.width = 1 + Math.random() * 2 + 'px';
    particle.style.height = particle.style.width;
    if (Math.random() > 0.6) particle.style.background = '#ff00e5';
    document.body.appendChild(particle);
  }
}

(function initBgCanvas() {
  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var container = document.getElementById('cyber-bg');
    container.appendChild(canvas);
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    var lines = [];
    for (var i = 0; i < 12; i += 1) {
      lines.push({ y: Math.random() * canvas.height, speed: 0.2 + Math.random() * 0.5, length: 60 + Math.random() * 120, opacity: 0.03 + Math.random() * 0.06, x: Math.random() * canvas.width });
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      lines.forEach(function (line) {
        line.x += line.speed;
        if (line.x > canvas.width + line.length) {
          line.x = -line.length;
          line.y = Math.random() * canvas.height;
        }
        var gradient = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.3, 'rgba(0, 240, 255, ' + line.opacity + ')');
        gradient.addColorStop(0.7, 'rgba(0, 240, 255, ' + line.opacity + ')');
        gradient.addColorStop(1, 'transparent');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y);
        ctx.stroke();
      });
      requestAnimationFrame(draw);
    }
    draw();
  });
})();

function addLog(text) {
  var log = document.getElementById('sys-log');
  var line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = '[' + new Date().toLocaleTimeString('en-US', { hour12: false }) + '] ' + text;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 20) log.removeChild(log.firstChild);
}

function showToast(message) {
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 2500);
}

function initPWA() {
  if (!('serviceWorker' in navigator)) {
    addLog('Service worker: Unavailable in this browser');
    return;
  }
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js').then(function () {
      addLog('Offline shell ready');
    }).catch(function () {
      addLog('Offline shell registration failed');
    });
  });
}
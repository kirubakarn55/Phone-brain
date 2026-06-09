// ===== PHONE BRAIN - Cyberpunk Dashboard Logic =====

// === STATE ===
let batteryLevel = 87;
let cpuUsage = 34;
let ramUsage = 52;
let currentMode = 'normal';
let voiceActive = false;
let chatVisible = false;
let recognition = null;

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initBattery();
  initCpuRam();
  initModes();
  initVoice();
  initAiOrb();
  initParticles();
  initPWA();
  addLog('System initialized');
  addLog('Neural core online');
  addLog('Sensors calibrated');
});

// === REAL-TIME CLOCK ===
function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('clock-time').textContent = `${h}:${m}:${s}`;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('clock-date').textContent = dateStr;

  const pct = ((now.getSeconds() / 59) * 100).toFixed(1);
  document.getElementById('seconds-fill').style.width = pct + '%';
}

// === BATTERY SIMULATION ===
function initBattery() {
  updateBattery();
  setInterval(() => {
    batteryLevel += (Math.random() - 0.52) * 2;
    batteryLevel = Math.max(15, Math.min(100, batteryLevel));
    updateBattery();
  }, 5000);
}

function updateBattery() {
  const val = Math.round(batteryLevel);
  document.getElementById('battery-val').textContent = val + '%';
  document.getElementById('battery-fill').style.width = val + '%';

  if (val < 25) {
    document.getElementById('battery-fill').style.background = '#ff3333';
  }
}

// === CPU & RAM SIMULATION ===
function initCpuRam() {
  updateCpuRam();
  setInterval(() => {
    cpuUsage += (Math.random() - 0.5) * 12;
    cpuUsage = Math.max(5, Math.min(99, cpuUsage));

    ramUsage += (Math.random() - 0.48) * 6;
    ramUsage = Math.max(20, Math.min(95, ramUsage));

    updateCpuRam();
  }, 2000);
}

function updateCpuRam() {
  const cpuVal = Math.round(cpuUsage);
  const ramVal = Math.round(ramUsage);

  document.getElementById('cpu-val').textContent = cpuVal + '%';
  document.getElementById('cpu-fill').style.width = cpuVal + '%';

  document.getElementById('ram-val').textContent = ramVal + '%';
  document.getElementById('ram-fill').style.width = ramVal + '%';
}

// === MODE BUTTONS ===
function initModes() {
  document.getElementById('gaming-btn').addEventListener('click', () => toggleMode('gaming'));
  document.getElementById('study-btn').addEventListener('click', () => toggleMode('study'));
}

function toggleMode(mode) {
  const statusEl = document.getElementById('mode-status');
  const gamingBtn = document.getElementById('gaming-btn');
  const studyBtn = document.getElementById('study-btn');

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
      addLog('Gaming mode activated - performance boost');
    } else {
      statusEl.className = 'mode-status study-active';
      statusEl.textContent = 'Study Mode Active';
      showToast('Study Mode ON');
      addLog('Study mode activated - focus lock');
    }
  }
}

// === VOICE COMMAND ===
function initVoice() {
  const voiceBtn = document.getElementById('voice-btn');

  voiceBtn.addEventListener('click', toggleVoice);
}

function toggleVoice() {
  const voiceBtn = document.getElementById('voice-btn');

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    showToast('Speech API not supported');
    return;
  }

  if (voiceActive) {
    stopVoice();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    voiceActive = true;
    voiceBtn.classList.add('active');
    document.querySelector('.ai-orb').classList.add('listening');
    addAiMessage('Listening...', 'system');
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();
    addAiMessage(text, 'user');
    handleVoiceCommand(text);
  };

  recognition.onerror = () => {
    stopVoice();
  };

  recognition.onend = () => {
    stopVoice();
  };

  recognition.start();
}

function stopVoice() {
  voiceActive = false;
  const voiceBtn = document.getElementById('voice-btn');
  voiceBtn.classList.remove('active');
  document.querySelector('.ai-orb').classList.remove('listening');
  if (recognition) {
    try { recognition.stop(); } catch (e) {}
  }
}

function handleVoiceCommand(text) {
  if (text.includes('gaming') || text.includes('game')) {
    toggleMode('gaming');
    addAiMessage('Gaming mode activated. Performance optimized.', 'ai');
  } else if (text.includes('study') || text.includes('focus')) {
    toggleMode('study');
    addAiMessage('Study mode activated. Distractions blocked.', 'ai');
  } else if (text.includes('normal') || text.includes('reset')) {
    if (currentMode !== 'normal') {
      toggleMode(currentMode);
    }
    addAiMessage('Normal mode restored.', 'ai');
  } else if (text.includes('battery') || text.includes('power')) {
    addAiMessage(`Battery at ${Math.round(batteryLevel)}%. Power management stable.`, 'ai');
  } else if (text.includes('cpu') || text.includes('processor')) {
    addAiMessage(`CPU usage: ${Math.round(cpuUsage)}%. Thermal status normal.`, 'ai');
  } else if (text.includes('ram') || text.includes('memory')) {
    addAiMessage(`RAM usage: ${Math.round(ramUsage)}%. Memory allocation optimal.`, 'ai');
  } else if (text.includes('time') || text.includes('clock')) {
    const now = new Date();
    addAiMessage(`Current time: ${now.toLocaleTimeString()}. All systems synced.`, 'ai');
  } else if (text.includes('hello') || text.includes('hey')) {
    addAiMessage('Hello, operator. All systems nominal.', 'ai');
  } else if (text.includes('status')) {
    addAiMessage(`System status: Battery ${Math.round(batteryLevel)}%, CPU ${Math.round(cpuUsage)}%, RAM ${Math.round(ramUsage)}%. Mode: ${currentMode}.`, 'ai');
  } else {
    addAiMessage('Command not recognized. Try: gaming, study, battery, cpu, ram, status.', 'ai');
  }
}

// === AI ORB ===
function initAiOrb() {
  const orb = document.querySelector('.ai-orb');
  const chat = document.getElementById('ai-chat');

  orb.addEventListener('click', () => {
    chatVisible = !chatVisible;
    chat.classList.toggle('visible', chatVisible);

    if (chatVisible && chat.children.length === 0) {
      addAiMessage('Phone Brain AI online. How can I assist you?', 'ai');
    }
  });
}

function addAiMessage(text, type) {
  const chat = document.getElementById('ai-chat');
  const msg = document.createElement('div');
  msg.className = `ai-msg ${type === 'user' ? 'user-msg' : type === 'system' ? 'system-msg' : ''}`;
  msg.textContent = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  // Keep last 8 messages
  while (chat.children.length > 8) {
    chat.removeChild(chat.firstChild);
  }
}

// === PARTICLES ===
function initParticles() {
  const count = 15;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.width = (1 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;

    if (Math.random() > 0.6) {
      p.style.background = '#ff00e5';
    }
    document.body.appendChild(p);
  }
}

// === CYBERPUNK BACKGROUND CANVAS ===
(function initBgCanvas() {
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('cyber-bg');
    container.appendChild(canvas);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const lines = [];
    const lineCount = 12;
    for (let i = 0; i < lineCount; i++) {
      lines.push({
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.5,
        length: 60 + Math.random() * 120,
        opacity: 0.03 + Math.random() * 0.06,
        x: Math.random() * canvas.width,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach(line => {
        line.x += line.speed;
        if (line.x > canvas.width + line.length) {
          line.x = -line.length;
          line.y = Math.random() * canvas.height;
        }

        const grad = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.3, `rgba(0, 240, 255, ${line.opacity})`);
        grad.addColorStop(0.7, `rgba(0, 240, 255, ${line.opacity})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
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

// === SYSTEM LOG ===
function addLog(text) {
  const log = document.getElementById('sys-log');
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  const line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = `[${time}] ${text}`;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;

  while (log.children.length > 20) {
    log.removeChild(log.firstChild);
  }
}

// Periodic system logs
setInterval(() => {
  const msgs = [
    'Neural sync complete',
    'Sensor array nominal',
    'Memory defrag cycle',
    'Thermal check passed',
    'Network latency: 12ms',
    'Firewall integrity: 100%',
    'Quantum bridge stable',
    'Haptic feedback online',
  ];
  addLog(msgs[Math.floor(Math.random() * msgs.length)]);
}, 8000);

// === TOAST NOTIFICATION ===
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// === PWA ===
function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
}

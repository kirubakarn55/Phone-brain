
/* ===== PHONE BRAIN - Cyberpunk Dashboard ===== */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --neon-cyan: #00f0ff;
  --neon-magenta: #ff00e5;
  --neon-green: #39ff14;
  --neon-orange: #ff6600;
  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(0, 240, 255, 0.15);
  --glow-cyan: 0 0 15px rgba(0, 240, 255, 0.4);
  --glow-magenta: 0 0 15px rgba(255, 0, 229, 0.4);
  --glow-green: 0 0 15px rgba(57, 255, 20, 0.4);
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: 'Courier New', 'Consolas', monospace;
  background: #000;
  color: #e0e0e0;
  min-height: 100vh;
  position: relative;
}

/* ===== ANIMATED CYBERPUNK BACKGROUND ===== */

#cyber-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

#cyber-bg canvas {
  width: 100%;
  height: 100%;
}

.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 8s linear infinite;
}

@keyframes gridMove {
  0% { transform: perspective(500px) rotateX(0deg); }
  100% { transform: perspective(500px) rotateX(2deg); }
}

.scanline {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(0, 240, 255, 0.06);
  z-index: 0;
  pointer-events: none;
  animation: scanMove 4s linear infinite;
}

@keyframes scanMove {
  0% { top: -3px; }
  100% { top: 100%; }
}

/* ===== MAIN CONTAINER ===== */

.container {
  position: relative;
  z-index: 1;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 100px;
}

/* ===== HEADER ===== */

.header {
  text-align: center;
  padding: 20px 0 10px;
}

.header h1 {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan), 0 0 30px rgba(0, 240, 255, 0.2);
  animation: textPulse 3s ease-in-out infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

.header .subtitle {
  font-size: 10px;
  letter-spacing: 4px;
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  margin-top: 4px;
  text-transform: uppercase;
}

/* ===== GLASS CARD ===== */

.glass-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.glass-card:hover {
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: var(--glow-cyan);
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.04), transparent);
  animation: cardShimmer 6s linear infinite;
}

@keyframes cardShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.card-label {
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(0, 240, 255, 0.6);
  margin-bottom: 10px;
}

/* ===== CLOCK ===== */

.clock-display {
  text-align: center;
  padding: 10px 0;
}

.clock-time {
  font-size: 52px;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  letter-spacing: 4px;
  line-height: 1.1;
}

.clock-date {
  font-size: 12px;
  letter-spacing: 3px;
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  margin-top: 6px;
  text-transform: uppercase;
}

.clock-seconds-bar {
  width: 100%;
  height: 2px;
  background: rgba(0, 240, 255, 0.1);
  margin-top: 12px;
  border-radius: 1px;
  overflow: hidden;
}

.clock-seconds-fill {
  height: 100%;
  background: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
  transition: width 1s linear;
  border-radius: 1px;
}

/* ===== STATS GRID ===== */

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-box {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 16px 14px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.stat-box:hover {
  border-color: rgba(0, 240, 255, 0.3);
}

.stat-icon {
  font-size: 20px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
}

.stat-value.battery-val { color: var(--neon-green); text-shadow: var(--glow-green); }
.stat-value.cpu-val { color: var(--neon-magenta); text-shadow: var(--glow-magenta); }
.stat-value.ram-val { color: var(--neon-orange); text-shadow: 0 0 15px rgba(255, 102, 0, 0.4); }

.stat-label {
  font-size: 9px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 4px;
}

.stat-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  margin-top: 8px;
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease;
}

.stat-bar-fill.battery-fill { background: var(--neon-green); box-shadow: var(--glow-green); }
.stat-bar-fill.cpu-fill { background: var(--neon-magenta); box-shadow: var(--glow-magenta); }
.stat-bar-fill.ram-fill { background: var(--neon-orange); box-shadow: 0 0 10px rgba(255, 102, 0, 0.4); }

/* ===== MODE BUTTONS ===== */

.mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mode-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 14px;
  padding: 18px 14px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.mode-btn .mode-icon {
  font-size: 22px;
  display: block;
  margin-bottom: 6px;
}

.mode-btn.gaming {
  border-color: rgba(255, 0, 229, 0.2);
}

.mode-btn.gaming:hover,
.mode-btn.gaming.active {
  border-color: var(--neon-magenta);
  box-shadow: var(--glow-magenta), inset 0 0 20px rgba(255, 0, 229, 0.1);
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
}

.mode-btn.study {
  border-color: rgba(57, 255, 20, 0.2);
}

.mode-btn.study:hover,
.mode-btn.study.active {
  border-color: var(--neon-green);
  box-shadow: var(--glow-green), inset 0 0 20px rgba(57, 255, 20, 0.1);
  color: var(--neon-green);
  text-shadow: var(--glow-green);
}

.mode-btn::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: width 0.4s, height 0.4s, top 0.4s, left 0.4s;
}

.mode-btn:active::after {
  width: 200px;
  height: 200px;
  top: calc(50% - 100px);
  left: calc(50% - 100px);
}

/* ===== AI ORB ===== */

.ai-orb-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 100;
}

.ai-orb {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(0, 240, 255, 0.3), rgba(0, 240, 255, 0.05));
  border: 2px solid rgba(0, 240, 255, 0.4);
  box-shadow: var(--glow-cyan), 0 0 40px rgba(0, 240, 255, 0.15);
  cursor: pointer;
  animation: orbFloat 3s ease-in-out infinite, orbPulse 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.ai-orb:hover {
  transform: scale(1.1);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.2);
}

.ai-orb.listening {
  border-color: var(--neon-magenta);
  box-shadow: var(--glow-magenta), 0 0 40px rgba(255, 0, 229, 0.2);
  animation: orbFloat 3s ease-in-out infinite, orbListenPulse 0.6s ease-in-out infinite;
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes orbPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.15); }
  50% { box-shadow: 0 0 25px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.25); }
}

@keyframes orbListenPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 229, 0.5), 0 0 50px rgba(255, 0, 229, 0.2); }
  50% { box-shadow: 0 0 35px rgba(255, 0, 229, 0.8), 0 0 70px rgba(255, 0, 229, 0.3); }
}

.ai-orb-inner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow: 0 0 10px var(--neon-cyan);
  animation: innerPulse 1.5s ease-in-out infinite;
}

@keyframes innerPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.7; }
}

/* ===== VOICE BUTTON ===== */

.voice-btn-container {
  text-align: center;
  padding: 10px 0;
}

.voice-btn {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  padding: 14px 32px;
  color: var(--neon-cyan);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.voice-btn:hover {
  border-color: var(--neon-cyan);
  box-shadow: var(--glow-cyan);
}

.voice-btn.active {
  border-color: var(--neon-magenta);
  color: var(--neon-magenta);
  box-shadow: var(--glow-magenta);
  animation: voiceBtnPulse 1s ease-in-out infinite;
}

@keyframes voiceBtnPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(255, 0, 229, 0.4); }
  50% { box-shadow: 0 0 30px rgba(255, 0, 229, 0.7); }
}

.voice-waves {
  display: flex;
  gap: 3px;
  align-items: center;
  height: 16px;
}

.voice-wave {
  width: 3px;
  height: 4px;
  background: currentColor;
  border-radius: 2px;
  transition: height 0.15s;
}

.voice-btn.active .voice-wave {
  animation: waveAnim 0.5s ease-in-out infinite;
}

.voice-btn.active .voice-wave:nth-child(2) { animation-delay: 0.1s; }
.voice-btn.active .voice-wave:nth-child(3) { animation-delay: 0.2s; }
.voice-btn.active .voice-wave:nth-child(4) { animation-delay: 0.3s; }
.voice-btn.active .voice-wave:nth-child(5) { animation-delay: 0.15s; }

@keyframes waveAnim {
  0%, 100% { height: 4px; }
  50% { height: 16px; }
}

/* ===== AI CHAT ===== */

.ai-chat {
  position: fixed;
  bottom: 145px;
  right: 20px;
  width: 280px;
  max-height: 300px;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 16px;
  z-index: 99;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow-y: auto;
  display: none;
  box-shadow: var(--glow-cyan);
}

.ai-chat.visible {
  display: block;
  animation: chatIn 0.3s ease;
}

@keyframes chatIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-msg {
  font-size: 12px;
  line-height: 1.5;
  color: var(--neon-cyan);
  margin-bottom: 8px;
  padding: 8px 10px;
  background: rgba(0, 240, 255, 0.05);
  border-radius: 8px;
  border-left: 2px solid var(--neon-cyan);
}

.ai-msg.user-msg {
  color: var(--neon-magenta);
  background: rgba(255, 0, 229, 0.05);
  border-left-color: var(--neon-magenta);
  text-align: right;
}

.ai-msg.system-msg {
  color: var(--neon-green);
  background: rgba(57, 255, 20, 0.05);
  border-left-color: var(--neon-green);
}

/* ===== STATUS BAR ===== */

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
  margin-bottom: 10px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-green);
  box-shadow: var(--glow-green);
  display: inline-block;
  animation: dotBlink 2s ease-in-out infinite;
}

@keyframes dotBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ===== MODE STATUS ===== */

.mode-status {
  text-align: center;
  padding: 8px;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-height: 32px;
}

.mode-status.gaming-active {
  color: var(--neon-magenta);
  text-shadow: var(--glow-magenta);
  background: rgba(255, 0, 229, 0.05);
}

.mode-status.study-active {
  color: var(--neon-green);
  text-shadow: var(--glow-green);
  background: rgba(57, 255, 20, 0.05);
}

/* ===== SYSTEM LOG ===== */

.sys-log {
  font-size: 10px;
  line-height: 1.6;
  color: rgba(0, 240, 255, 0.5);
  max-height: 80px;
  overflow-y: auto;
  scrollbar-width: none;
}

.sys-log::-webkit-scrollbar { display: none; }

.log-line {
  animation: logIn 0.3s ease;
}

@keyframes logIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ===== RESPONSIVE ===== */

@media (max-width: 360px) {
  .clock-time { font-size: 40px; }
  .header h1 { font-size: 22px; }
  .stat-value { font-size: 20px; }
}

@media (min-width: 481px) {
  .container { padding: 24px 24px 100px; }
}

/* ===== SCROLLBAR ===== */

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(0, 240, 255, 0.2); border-radius: 2px; }

/* ===== NOTIFICATION TOAST ===== */

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-80px);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--neon-cyan);
  border-radius: 12px;
  padding: 12px 24px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--neon-cyan);
  text-shadow: var(--glow-cyan);
  z-index: 200;
  transition: transform 0.4s ease;
  backdrop-filter: blur(12px);
  text-transform: uppercase;
  white-space: nowrap;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
}

/* ===== PARTICLES ===== */

.particle {
  position: fixed;
  width: 2px;
  height: 2px;
  background: var(--neon-cyan);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  animation: particleDrift 8s linear infinite;
}

@keyframes particleDrift {
  0% { opacity: 0; transform: translateY(100vh); }
  10% { opacity: 0.6; }
  90% { opacity: 0.6; }
  100% { opacity: 0; transform: translateY(-20px); }
}
```

---

**script.js**

```javascript
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
    try { recognition.stop(); } 

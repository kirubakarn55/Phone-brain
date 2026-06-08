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
        addLog('Gaming mode activated - performance boost!');
    } else if (mode === 'study') {
        statusEl.className = 'mode-status study-active';
        statusEl.textContent = 'Study Mode Active';
        showToast('Study Mode ON');
        addLog('Study mode activated - focus lock!');
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
        addMessage('Listening...', 'system');
    };

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        addMessage(text, 'user');
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
    } else if (text.includes('study') || text.includes('focus')) {
        toggleMode('study');
    } else if (text.includes('normal') || text.includes('reset')) {
        toggleMode('normal');
    } else if (text.includes('power') || text.includes('battery')) {
        addMessage(`Battery at ${Math.round(batteryLevel)}%.`, 'ai');
    } else if (text.includes('cpu') || text.includes('processor')) {
        addMessage(`CPU usage: ${Math.round(cpuUsage)}%.`, 'ai');
    } else if (text.includes('memory') || text.includes('ram')) {
        addMessage(`RAM usage: ${Math.round(ramUsage)}%.`, 'ai');
    } else if (text.includes('time') || text.includes('clock')) {
        addMessage(`Current time: ${new Date().toLocaleTimeString()}`, 'ai');
    } else if (text.includes('hello') || text.includes('hey')) {
        addMessage('Hello, operator. All systems nominal.', 'ai');
    } else if (text.includes('status')) {
        addMessage(`System status: Battery ${Math.round(batteryLevel)}%, CPU ${Math.round(cpuUsage)}%, RAM ${Math.round(ramUsage)}%.`, 'ai');
    } else {
        addMessage('Command not recognized. Try: gaming, study, battery, cpu, ram, status.', 'ai');
    }
}

// === AI ORB ===
function initAIOrb() {
    const orb = document.querySelector('.ai-orb');
    const chat = document.getElementById('ai-chat');

    orb.addEventListener('click', () => {
        chat.classList.toggle('visible');
        if (chat.children.length === 0) {
            addMessage('Phone Brain AI online. How can I assist you?', 'ai');
        }
    });
}

function addMessage(text, type) {
    const chat = document.getElementById('ai-chat');
    const msg = document.createElement('div');
    msg.className = `ai-msg ${type === 'user' ? 'user-msg' : 'ai-msg'}`;
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
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = `${Math.random() * 100}vw`;
        p.style.animationDuration = `${6 + Math.random() * 8}s`;
        p.style.height = `${Math.random() * 2 + 1}px`;
        p.style.opacity = Math.random() * 0.6;
        container.appendChild(p);
    }
}

// === CYBERPUNK BACKGROUND CANVAS ===
function initBgCanvas() {
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
            }
            line.y = Math.random() * canvas.height;

            const grad = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.3)');
            grad.addColorStop(0.7, 'rgba(0, 240, 255, 0.3)');
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
}

// === SYSTEM LOG ===
function addLog(text) {
    const log = document.getElementById('sys-log');
    const line = document.createElement('div');
    line.className = 'log-line';
    line.textContent = `[${new Date().toLocaleTimeString('en-US', {hour12: false})}] ${text}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;

    while (log.children.length > 20) {
        log.removeChild(log.firstChild);
    }
}

// Periodic system logs
setInterval(() => {
    const msgs = [
        'Neural sync complete.',
        'Sensor array nominal.',
        'Memory defrag cycle.',
        'Thermal check passed.',
        'Network latency: 12ms.',
        'Firmware integrity: 100%.',
        'Quantum bridge stable.',
        'Haptic feedback online.'
    ];
    addLog(msgs[Math.floor(Math.random() * msgs.length)]);
}, 8000);

function showToast(msg) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 2500);
    }, 2500);
}

// === PWA ===
function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        });
    }
}

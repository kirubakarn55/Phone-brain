# Phone Brain

Phone Brain is a futuristic cyberpunk personal-assistant dashboard built with HTML, CSS, JavaScript, browser APIs, and PWA support.

## Phase 1 architecture

- script.js is the dashboard and UI layer. It keeps the clock, cyberpunk effects, mode controls, toast notifications, system log, and orb UI.
- assistant.js is the central command processor. Text and voice commands enter through Assistant.processCommand(text), which routes safe local commands and reports unknown commands clearly.
- storage.js provides versioned localStorage slots for settings, memories, notes, conversation history, and study progress.
- speech.js wraps SpeechRecognition/webkitSpeechRecognition and SpeechSynthesis with browser capability checks.
- device.js wraps supported browser APIs for battery, vibration, clipboard, sharing, fullscreen, connectivity, PWA installation, and screen orientation.
- sw.js caches the complete Phase 1 offline shell using a versioned cache.

## Current commands

Try commands such as:

- what time is it
- what is my battery
- start gaming mode
- start study mode
- normal mode
- open YouTube
- search Google for Python
- search YouTube for SQL tutorial
- remember that I prefer morning study sessions

## Browser limitations

- Battery status is shown only when the browser exposes the Battery Status API.
- Reliable CPU and RAM usage are not exposed by normal browser pages, so Phone Brain reports them as unavailable instead of simulating values.
- Speech recognition and speech synthesis depend on browser support and permissions.
- Clipboard, sharing, fullscreen, vibration, orientation locking, and PWA installation are capability- and permission-dependent.
- Android-only actions such as controlling Wi-Fi, Bluetooth, killing apps, and changing system settings are not implemented by this web app.
- AI has not been connected yet. Phase 1 uses safe local commands and stores data locally; a future AI backend must keep API keys server-side.

## Local development

Serve the repository over HTTPS or localhost so modules and the service worker can run. Opening index.html directly with a file URL will not provide full PWA or module behavior.

## Deployment

The project remains compatible with static hosting for Phase 1. A backend-capable deployment is required before adding a real AI provider.

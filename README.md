# Phone Brain

Phone Brain is a futuristic cyberpunk personal-assistant dashboard built with HTML, CSS, JavaScript, browser APIs, and PWA support.

## Phase 2 architecture

- script.js remains the dashboard and UI layer. Existing clock, modes, toast notifications, system log, orb, particles, and cyberpunk styling are preserved.
- assistant.js is the single command processor for both text and voice input.
- memory.js manages local memories with secret-pattern protection.
- notes.js manages persistent notes, search, edits, deletes, and gaming notes.
- study.js provides offline explanations, MCQs, quiz state, focus timers, and progress.
- coding.js provides static explanations, heuristic error checks, fix guidance, and examples. It never executes pasted code.
- gaming.js provides favorites, gaming notes, and a real elapsed timer. It does not claim CPU/GPU boosting.
- launcher.js accepts only HTTPS URLs without credentials and rejects unsafe URL schemes.
- settings.js persists names, voice preference, speech rate, reduced motion, and clear actions.
- storage.js uses versioned localStorage slots for settings, memories, notes, history, study progress, gaming favorites, and launcher shortcuts.
- sw.js caches the complete Phase 2 offline shell using a versioned cache.

## Current commands

Try:

- what do you remember about me
- remember that I prefer morning study sessions
- forget morning study
- create a note buy a USB microphone
- show my notes
- search my notes for microphone
- delete my note microphone
- explain Python functions
- explain SQL joins
- quiz me on Python
- focus timer for 25 minutes
- gaming timer for 60 minutes
- gaming note test controller battery
- open YouTube
- search Google for Python
- voice on or voice off
- clear memory, clear notes, or clear history

## Browser and privacy limitations

- Memories are stored locally and refuse common password, API-key, token, secret, private-key, and credential patterns. This is a protective filter, not a substitute for security review.
- Battery status is shown only when the browser exposes the Battery Status API. CPU and RAM usage are not simulated because normal web pages cannot reliably access them.
- Speech recognition and speech synthesis depend on browser support and permissions.
- Clipboard, sharing, fullscreen, vibration, orientation locking, and PWA installation remain capability- and permission-dependent.
- Android-only actions such as controlling Wi-Fi, Bluetooth, killing apps, and changing system settings are not implemented.
- Study explanations and coding guidance in this phase are local/static. No external AI or API key is present.

## Local development

Serve the repository over HTTPS or localhost. Opening index.html directly with a file URL will not provide full PWA or module behavior.

## Deployment

The project remains compatible with static hosting for Phase 2. A backend-capable deployment is required before adding a real AI provider.

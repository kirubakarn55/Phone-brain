# Phone Brain

Phone Brain is a cyberpunk personal-assistant PWA. Phase 1 and Phase 2 local features remain available offline. Phase 3 adds an optional secure AI path without placing credentials in browser code.

## Phase 3 architecture

Phone Brain PWA -> same-origin or configured HTTPS backend -> provider-compatible AI endpoint -> safe JSON response -> Phone Brain.

- assistant.js remains the single command-processing entry point.
- Local deterministic commands and local modules run first.
- api.js sends only open-ended requests to /api/assistant. It has no API key.
- config.js contains only a changeable backend URL; it must never contain credentials.
- server/index.js provides a small backend server and static hosting for backend-capable deployments.
- server/routes/assistant.js validates requests, enforces body limits, keeps the provider credential server-side, applies timeouts, and returns safe JSON.
- AI action responses are restricted to predefined actions: built-in site opening, note creation, mode selection, and focus timers. Arbitrary URLs, browser commands, and code are never executed.

## Backend configuration

The backend reads these server environment variables:

- AI_API_KEY — required secret, supplied through the deployment platform's server-side secret manager.
- AI_API_URL — optional OpenAI-compatible chat endpoint; defaults to the standard chat-completions endpoint.
- AI_MODEL — optional provider model name; defaults to gpt-4o-mini.
- FRONTEND_ORIGIN — optional exact HTTPS frontend origin for cross-origin requests.
- PORT — optional server port; defaults to 3000.

Never add an actual secret to this repository, config.js, HTML, browser JavaScript, or the service worker.

## Run the backend

Use Node.js 20 or newer:

    AI_API_KEY=your-secret-value AI_MODEL=your-model npm start

Set the value through the host's secret/environment interface rather than committing it or pasting it into source. The command above is illustrative only; the actual secret must not be written into files or chat.

For a same-origin deployment, serve Phone Brain from this Node server and leave config.js with an empty backend URL. For GitHub Pages plus a separate backend, set the deploy-time backendUrl in config.js to the backend's HTTPS origin, for example https://ai.example.com, and set the backend's exact FRONTEND_ORIGIN to the GitHub Pages origin. This changes routing only; it does not expose the key.

## GitHub Pages limitation

GitHub Pages can continue hosting the static PWA, but it cannot safely host a server-side API key or run /api/assistant. Without a separately deployed backend, open-ended requests honestly fall back with an AI-unavailable message while local Phone Brain functionality continues working.

## Local functionality

These remain local/offline:

- Memory, Notes, Study explanations, quizzes, progress, and focus timers
- Coding static review and safe examples
- Gaming favorites, notes, and timers
- Launcher built-ins and HTTPS shortcut validation
- Settings, speech wrappers, battery capability detection, history, and PWA shell

The browser never executes pasted code, AI-generated code, arbitrary scripts, or unrestricted AI actions. CPU and RAM metrics remain unavailable rather than simulated.

## AI behavior and failure handling

The backend is used only for open-ended reasoning such as recursion explanations, broad learning questions, code reasoning, or study plans. Local commands are not sent to the AI provider. Offline devices, missing backend configuration, provider errors, malformed responses, and timeouts produce an honest fallback message; they do not disable local features.

AI output is displayed as text. Only validated predefined actions can be considered, and the frontend validates them again through existing modules. Returned code is never run.

## Existing app

The existing cyberpunk dashboard and Phase 1/Phase 2 panels are preserved. Serve the repository over HTTPS or localhost for browser module and PWA behavior. The project remains the original Phone-brain repository and main branch.

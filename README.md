# Ayeoh

Ayeoh ("I/O") is a small Electron desktop app that shows, in real time, every input you give your computer — keyboard presses, mouse clicks/scrolls/movement, game controller buttons and sticks, and spoken voice — as large on-screen feedback, with text-to-speech announcing non-voice input out loud.

It was built to help a kid build a clearer mental model of what their input devices actually do: press a key, see and hear what happened, immediately. It's also just generally useful for anyone who wants clear, accessible feedback on input devices (testing peripherals, accessibility demos, etc).

## How it works

- **Keyboard & mouse** are captured globally (even when the app isn't focused) by a native hook (`uiohook-napi`) running in the Electron main process, normalized into a common event shape, and sent to the renderer over IPC.
- **Game controllers** are read in the renderer via the browser's [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) (polled continuously), since that API only exists in a web/renderer context.
- **Voice** is transcribed fully offline using [Vosk](https://alphacephei.com/vosk/) (via the `vosk-koffi` binding) on captured microphone audio in the main process — no audio leaves the device, and no internet connection is required. (The browser's built-in `SpeechRecognition` was intentionally avoided because it calls out to Google's servers and won't work offline.)
- **Text-to-speech** uses the browser's built-in `speechSynthesis` API, which works fully offline using the operating system's installed voices. Voice input itself is not spoken back (to avoid echoing what was just said).
- All input events flow through one shared, in-memory history (Zustand store) that drives both the big visual feedback display and a scrolling recent-input log.

## Project layout

```
electron/
  main.ts            Electron app lifecycle, window creation, wires up capture + voice
  preload.ts         contextBridge: exposes a typed window.ayeoh API to the renderer
  inputCapture.ts     Global keyboard/mouse capture (uiohook-napi) -> normalized events
  voice/voskService.ts  Offline speech-to-text via Vosk + mic capture
src/
  input/             Shared event types, normalization logic, Gamepad polling, TTS hook
  store/             Zustand store: input history + user settings (persisted)
  theme/             Light/dark Emotion themes
  components/        InputFeedback (big display), InputLog, SettingsScreen, Layout
```

## Setup

```bash
npm install
```

### Voice recognition (optional)

Voice input requires a Vosk speech model, downloaded separately (it's too large to commit to the repo):

1. Download a model from the [Vosk model list](https://alphacephei.com/vosk/models) — `vosk-model-small-en-us-0.15` is a good lightweight default.
2. Unzip it into `models/vosk-model-small-en-us` at the repo root (so `models/vosk-model-small-en-us/am/final.mdl` exists).

If no model is present at startup, voice input is silently disabled — keyboard, mouse, and controller input still work normally.

Microphone capture uses [`mic`](https://www.npmjs.com/package/mic), which shells out to a system audio tool:
- **Windows / macOS**: install [SoX](http://sox.sourceforge.net/) and ensure it's on your `PATH`.
- **Linux**: install ALSA tools (`sudo apt-get install alsa-utils`).

## Development

```bash
npm run dev
```

This starts Vite and automatically launches the Electron window pointed at the dev server, with hot reload for the renderer.

## Testing & quality

```bash
npm run test     # Vitest unit + component tests
npm run lint      # oxlint
npm run build     # type-check + build renderer and electron main/preload
```

## Packaging

```bash
npm run build-electron
```

Produces a packaged app under `release/` via `electron-builder`.

## Settings

The in-app Settings screen (top-right button) lets you:
- Toggle dark mode (applies live, persists across restarts)
- Mute/unmute feedback per input source (keyboard, mouse, gamepad, voice)
- Adjust text-to-speech volume

## Accessibility notes

- Visual feedback uses large text and icons for legibility at a distance.
- All non-voice input is paired with spoken feedback by default, so the app is usable without reading the screen.
- Per-source muting lets a user (or a parent/guardian) tune the experience down if it becomes overwhelming.

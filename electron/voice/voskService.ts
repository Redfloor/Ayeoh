import path from 'node:path';
import fs from 'node:fs';
import { app, ipcMain, type BrowserWindow } from 'electron';
import vosk from 'vosk-koffi';
import { normalizeVoice } from '../../src/input/normalize';

const SAMPLE_RATE = 16000;

// process.cwd() is unpredictable for a double-clicked installed app, and a packaged
// app ships its bundled resources under process.resourcesPath, not next to the exe.
const MODEL_BASE_DIR = app.isPackaged ? process.resourcesPath : process.cwd();
const DEFAULT_MODEL_DIR = path.join(MODEL_BASE_DIR, 'models', 'vosk-model-small-en-us');

interface VoiceServiceHandle {
  stop: () => void;
}

export function isVoskModelAvailable(modelPath: string = DEFAULT_MODEL_DIR): boolean {
  return fs.existsSync(modelPath);
}

export function startVoiceService(
  window: BrowserWindow,
  options: { modelPath?: string } = {},
): VoiceServiceHandle | null {
  const modelPath = options.modelPath ?? DEFAULT_MODEL_DIR;

  if (!isVoskModelAvailable(modelPath)) {
    return null;
  }

  vosk.setLogLevel(-1);
  const model = new vosk.Model(modelPath);
  const recognizer = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });

  const onAudioChunk = (_event: unknown, chunk: ArrayBuffer): void => {
    const hasUtterance = recognizer.acceptWaveform(Buffer.from(chunk));
    if (!hasUtterance) {
      return;
    }
    const { text } = recognizer.result().alternatives[0] ?? { text: '' };
    if (text.trim().length > 0) {
      window.webContents.send('ayeoh:input-event', normalizeVoice(text.trim()));
    }
  };

  ipcMain.on('ayeoh:voice-audio-chunk', onAudioChunk);

  return {
    stop: () => {
      ipcMain.removeListener('ayeoh:voice-audio-chunk', onAudioChunk);
      recognizer.free();
      model.free();
    },
  };
}

import path from 'node:path';
import fs from 'node:fs';
import type { BrowserWindow } from 'electron';
import mic from 'mic';
import vosk from 'vosk-koffi';
import { normalizeVoice } from '../../src/input/normalize';

const SAMPLE_RATE = 16000;
const DEFAULT_MODEL_DIR = path.join(process.cwd(), 'models', 'vosk-model-small-en-us');

interface VoiceServiceHandle {
  stop: () => void;
}

export function isVoskModelAvailable(modelPath: string = DEFAULT_MODEL_DIR): boolean {
  return fs.existsSync(modelPath);
}

export function startVoiceService(
  window: BrowserWindow,
  options: { modelPath?: string; deviceId?: string | null } = {},
): VoiceServiceHandle | null {
  const modelPath = options.modelPath ?? DEFAULT_MODEL_DIR;

  if (!isVoskModelAvailable(modelPath)) {
    return null;
  }

  vosk.setLogLevel(-1);
  const model = new vosk.Model(modelPath);
  const recognizer = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });

  const micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    device: options.deviceId ?? 'default',
  });
  const micStream = micInstance.getAudioStream();

  micStream.on('data', (chunk: Buffer) => {
    const hasUtterance = recognizer.acceptWaveform(chunk);
    if (!hasUtterance) {
      return;
    }
    const { text } = recognizer.result().alternatives[0] ?? { text: '' };
    if (text.trim().length > 0) {
      window.webContents.send('ayeoh:input-event', normalizeVoice(text.trim()));
    }
  });

  micStream.on('error', (err: Error) => {
    console.error('[voskService] mic stream error:', err);
  });

  micInstance.start();

  return {
    stop: () => {
      micInstance.stop();
      recognizer.free();
      model.free();
    },
  };
}

import { contextBridge, ipcRenderer } from 'electron';
import type { InputEvent } from '../src/input/types';

export interface AyeohBridge {
  quitApp: () => void;
  isVoiceAvailable: () => Promise<boolean>;
  onInputEvent: (callback: (event: InputEvent) => void) => () => void;
}

const bridge: AyeohBridge = {
  quitApp: () => ipcRenderer.send('ayeoh:quit-app'),
  isVoiceAvailable: () => ipcRenderer.invoke('ayeoh:voice-available'),
  onInputEvent: (callback) => {
    const listener = (_event: unknown, payload: InputEvent): void => callback(payload);
    ipcRenderer.on('ayeoh:input-event', listener);
    return () => ipcRenderer.removeListener('ayeoh:input-event', listener);
  },
};

contextBridge.exposeInMainWorld('ayeoh', bridge);

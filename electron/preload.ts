import { contextBridge, ipcRenderer } from 'electron';
import type { InputEvent, KeyStateChange, MouseButtonStateChange } from '../src/input/types';

export interface AyeohBridge {
  quitApp: () => void;
  isVoiceAvailable: () => Promise<boolean>;
  onInputEvent: (callback: (event: InputEvent) => void) => () => void;
  onKeyState: (callback: (change: KeyStateChange) => void) => () => void;
  onMouseButtonState: (callback: (change: MouseButtonStateChange) => void) => () => void;
}

function subscribe<T>(channel: string, callback: (payload: T) => void): () => void {
  const listener = (_event: unknown, payload: T): void => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

const bridge: AyeohBridge = {
  quitApp: () => ipcRenderer.send('ayeoh:quit-app'),
  isVoiceAvailable: () => ipcRenderer.invoke('ayeoh:voice-available'),
  onInputEvent: (callback) => subscribe('ayeoh:input-event', callback),
  onKeyState: (callback) => subscribe('ayeoh:key-state', callback),
  onMouseButtonState: (callback) => subscribe('ayeoh:mouse-button-state', callback),
};

contextBridge.exposeInMainWorld('ayeoh', bridge);

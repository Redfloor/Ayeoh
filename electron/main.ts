import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startInputCapture } from './inputCapture';
import { isVoskModelAvailable, startVoiceService } from './voice/voskService';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

let stopInputCapture: (() => void) | null = null;
let voiceHandle: { stop: () => void } | null = null;

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL !== undefined) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  stopInputCapture = startInputCapture(mainWindow);
  try {
    voiceHandle = startVoiceService(mainWindow);
  } catch (error) {
    console.error('[main] failed to start voice service, voice input is disabled:', error);
    voiceHandle = null;
  }

  mainWindow.on('closed', () => {
    stopInputCapture?.();
    voiceHandle?.stop();
  });

  return mainWindow;
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('ayeoh:quit-app', () => {
  app.quit();
});

ipcMain.handle('ayeoh:voice-available', () => isVoskModelAvailable());

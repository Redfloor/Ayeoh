import { uIOhook, UiohookKey, type UiohookKeyboardEvent, type UiohookMouseEvent, type UiohookWheelEvent } from 'uiohook-napi';
import type { BrowserWindow } from 'electron';
import {
  normalizeKeyboard,
  normalizeMouseButton,
  normalizeMouseMove,
  normalizeMouseWheel,
} from '../src/input/normalize';
import type { InputEvent, KeyStateChange, MouseButtonStateChange } from '../src/input/types';

const KEY_NAME_BY_CODE = new Map<number, string>(
  Object.entries(UiohookKey).map(([name, code]) => [code, name]),
);

const MOUSE_MOVE_THROTTLE_MS = 400;
let lastMouseMoveSentAt = 0;

function send(window: BrowserWindow, event: InputEvent | null): void {
  if (event === null) {
    return;
  }
  window.webContents.send('ayeoh:input-event', event);
}

function sendKeyState(window: BrowserWindow, payload: KeyStateChange): void {
  window.webContents.send('ayeoh:key-state', payload);
}

function sendMouseButtonState(window: BrowserWindow, payload: MouseButtonStateChange): void {
  window.webContents.send('ayeoh:mouse-button-state', payload);
}

export function startInputCapture(window: BrowserWindow): () => void {
  const onKeydown = (e: UiohookKeyboardEvent): void => {
    const keyName = KEY_NAME_BY_CODE.get(e.keycode) ?? `Key ${e.keycode}`;
    send(window, normalizeKeyboard(keyName, 'down'));
    sendKeyState(window, { key: keyName, pressed: true });
  };

  const onKeyup = (e: UiohookKeyboardEvent): void => {
    const keyName = KEY_NAME_BY_CODE.get(e.keycode) ?? `Key ${e.keycode}`;
    sendKeyState(window, { key: keyName, pressed: false });
  };

  const onMousedown = (e: UiohookMouseEvent): void => {
    const button = Number(e.button);
    send(window, normalizeMouseButton(button, 'down'));
    sendMouseButtonState(window, { button, pressed: true });
  };

  const onMouseup = (e: UiohookMouseEvent): void => {
    sendMouseButtonState(window, { button: Number(e.button), pressed: false });
  };

  const onMousemove = (): void => {
    const now = Date.now();
    if (now - lastMouseMoveSentAt < MOUSE_MOVE_THROTTLE_MS) {
      return;
    }
    lastMouseMoveSentAt = now;
    send(window, normalizeMouseMove());
  };

  const onWheel = (e: UiohookWheelEvent): void => {
    send(window, normalizeMouseWheel(e.rotation < 0 ? 'up' : 'down'));
  };

  uIOhook.on('keydown', onKeydown);
  uIOhook.on('keyup', onKeyup);
  uIOhook.on('mousedown', onMousedown);
  uIOhook.on('mouseup', onMouseup);
  uIOhook.on('mousemove', onMousemove);
  uIOhook.on('wheel', onWheel);
  uIOhook.start();

  return () => {
    uIOhook.off('keydown', onKeydown);
    uIOhook.off('keyup', onKeyup);
    uIOhook.off('mousedown', onMousedown);
    uIOhook.off('mouseup', onMouseup);
    uIOhook.off('mousemove', onMousemove);
    uIOhook.off('wheel', onWheel);
    uIOhook.stop();
  };
}

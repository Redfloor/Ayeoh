import { uIOhook, UiohookKey, type UiohookKeyboardEvent, type UiohookMouseEvent, type UiohookWheelEvent } from 'uiohook-napi';
import type { BrowserWindow } from 'electron';
import {
  normalizeKeyboard,
  normalizeMouseButton,
  normalizeMouseMove,
  normalizeMouseWheel,
} from '../src/input/normalize';
import type { InputEvent } from '../src/input/types';

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

export function startInputCapture(window: BrowserWindow): () => void {
  const onKeydown = (e: UiohookKeyboardEvent): void => {
    const keyName = KEY_NAME_BY_CODE.get(e.keycode) ?? `Key ${e.keycode}`;
    send(window, normalizeKeyboard(keyName, 'down'));
  };

  const onMousedown = (e: UiohookMouseEvent): void => {
    send(window, normalizeMouseButton(Number(e.button), 'down'));
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
  uIOhook.on('mousedown', onMousedown);
  uIOhook.on('mousemove', onMousemove);
  uIOhook.on('wheel', onWheel);
  uIOhook.start();

  return () => {
    uIOhook.off('keydown', onKeydown);
    uIOhook.off('mousedown', onMousedown);
    uIOhook.off('mousemove', onMousemove);
    uIOhook.off('wheel', onWheel);
    uIOhook.stop();
  };
}

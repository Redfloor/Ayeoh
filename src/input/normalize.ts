import type {
  GamepadInputEvent,
  KeyboardInputEvent,
  MouseInputEvent,
  VoiceInputEvent,
} from './types';

let counter = 0;

function nextId(): string {
  counter += 1;
  return `${Date.now()}-${counter}`;
}

export function normalizeKeyboard(
  key: string,
  direction: 'down' | 'up',
): KeyboardInputEvent | null {
  if (direction === 'up') {
    return null;
  }
  return {
    id: nextId(),
    source: 'keyboard',
    key,
    label: key,
    timestamp: Date.now(),
  };
}

const MOUSE_BUTTON_LABELS: Record<number, string> = {
  1: 'Left Click',
  2: 'Right Click',
  3: 'Middle Click',
};

export function normalizeMouseButton(
  button: number,
  direction: 'down' | 'up',
): MouseInputEvent | null {
  if (direction === 'up') {
    return null;
  }
  return {
    id: nextId(),
    source: 'mouse',
    kind: 'button',
    button,
    label: MOUSE_BUTTON_LABELS[button] ?? `Mouse Button ${button}`,
    timestamp: Date.now(),
  };
}

export function normalizeMouseWheel(direction: 'up' | 'down'): MouseInputEvent {
  return {
    id: nextId(),
    source: 'mouse',
    kind: 'wheel',
    label: direction === 'up' ? 'Scroll Up' : 'Scroll Down',
    timestamp: Date.now(),
  };
}

export function normalizeMouseMove(): MouseInputEvent {
  return {
    id: nextId(),
    source: 'mouse',
    kind: 'move',
    label: 'Mouse Move',
    timestamp: Date.now(),
  };
}

const GAMEPAD_BUTTON_LABELS: Record<number, string> = {
  0: 'A / Cross',
  1: 'B / Circle',
  2: 'X / Square',
  3: 'Y / Triangle',
  4: 'Left Bumper',
  5: 'Right Bumper',
  6: 'Left Trigger',
  7: 'Right Trigger',
  8: 'Select',
  9: 'Start',
  10: 'Left Stick Click',
  11: 'Right Stick Click',
  12: 'D-Pad Up',
  13: 'D-Pad Down',
  14: 'D-Pad Left',
  15: 'D-Pad Right',
  16: 'Home',
};

export function normalizeGamepadButton(
  gamepadIndex: number,
  controlIndex: number,
): GamepadInputEvent {
  return {
    id: nextId(),
    source: 'gamepad',
    kind: 'button',
    gamepadIndex,
    controlIndex,
    label: GAMEPAD_BUTTON_LABELS[controlIndex] ?? `Button ${controlIndex}`,
    timestamp: Date.now(),
  };
}

const GAMEPAD_AXIS_LABELS: Record<number, string> = {
  0: 'Left Stick',
  1: 'Left Stick',
  2: 'Right Stick',
  3: 'Right Stick',
};

export function normalizeGamepadAxis(
  gamepadIndex: number,
  controlIndex: number,
): GamepadInputEvent {
  return {
    id: nextId(),
    source: 'gamepad',
    kind: 'axis',
    gamepadIndex,
    controlIndex,
    label: GAMEPAD_AXIS_LABELS[controlIndex] ?? `Axis ${controlIndex}`,
    timestamp: Date.now(),
  };
}

export function normalizeVoice(transcript: string): VoiceInputEvent {
  return {
    id: nextId(),
    source: 'voice',
    transcript,
    label: transcript,
    timestamp: Date.now(),
  };
}

import { describe, expect, it } from 'vitest';
import {
  normalizeGamepadAxis,
  normalizeGamepadButton,
  normalizeKeyboard,
  normalizeMouseButton,
  normalizeMouseWheel,
  normalizeVoice,
} from './normalize';

describe('normalizeKeyboard', () => {
  it('produces an event for a key-down', () => {
    const event = normalizeKeyboard('A', 'down');
    expect(event?.source).toBe('keyboard');
    expect(event?.label).toBe('A');
  });

  it('ignores key-up', () => {
    expect(normalizeKeyboard('A', 'up')).toBeNull();
  });
});

describe('normalizeMouseButton', () => {
  it('maps known button numbers to friendly labels', () => {
    expect(normalizeMouseButton(1, 'down')?.label).toBe('Left Click');
    expect(normalizeMouseButton(2, 'down')?.label).toBe('Right Click');
  });

  it('falls back to a generic label for unknown buttons', () => {
    expect(normalizeMouseButton(9, 'down')?.label).toBe('Mouse Button 9');
  });

  it('ignores button-up', () => {
    expect(normalizeMouseButton(1, 'up')).toBeNull();
  });
});

describe('normalizeMouseWheel', () => {
  it('labels scroll direction', () => {
    expect(normalizeMouseWheel('up').label).toBe('Scroll Up');
    expect(normalizeMouseWheel('down').label).toBe('Scroll Down');
  });
});

describe('normalizeGamepadButton', () => {
  it('maps known indices to friendly labels', () => {
    expect(normalizeGamepadButton(0, 0).label).toBe('A / Cross');
  });

  it('falls back to a generic label for unknown indices', () => {
    expect(normalizeGamepadButton(0, 99).label).toBe('Button 99');
  });
});

describe('normalizeGamepadAxis', () => {
  it('maps stick axes to friendly labels', () => {
    expect(normalizeGamepadAxis(0, 0).label).toBe('Left Stick');
    expect(normalizeGamepadAxis(0, 2).label).toBe('Right Stick');
  });
});

describe('normalizeVoice', () => {
  it('uses the transcript as the label', () => {
    const event = normalizeVoice('hello there');
    expect(event.transcript).toBe('hello there');
    expect(event.label).toBe('hello there');
  });
});

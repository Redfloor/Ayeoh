import { useEffect, type ReactNode } from 'react';
import { useAyeohStore } from '../store/ayeohStore';
import { normalizeGamepadAxis, normalizeGamepadButton } from './normalize';

const AXIS_DEADZONE = 0.5;
const GAMEPAD_POLL_INTERVAL_MS = 50;

function pollGamepads(
  previousButtons: Map<string, boolean>,
  previousAxes: Map<string, boolean>,
  onEvent: (event: ReturnType<typeof normalizeGamepadButton>) => void,
): void {
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (pad === null) {
      continue;
    }
    pad.buttons.forEach((button, index) => {
      const key = `${pad.index}:${index}`;
      const wasPressed = previousButtons.get(key) ?? false;
      if (button.pressed && !wasPressed) {
        onEvent(normalizeGamepadButton(pad.index, index));
      }
      previousButtons.set(key, button.pressed);
    });

    pad.axes.forEach((value, index) => {
      const key = `${pad.index}:${index}`;
      const isActive = Math.abs(value) > AXIS_DEADZONE;
      const wasActive = previousAxes.get(key) ?? false;
      if (isActive && !wasActive) {
        onEvent(normalizeGamepadAxis(pad.index, index));
      }
      previousAxes.set(key, isActive);
    });
  }
}

export function InputProvider({ children }: { children: ReactNode }): ReactNode {
  const pushEvent = useAyeohStore((state) => state.pushEvent);

  useEffect(() => {
    const unsubscribe = window.ayeoh?.onInputEvent((event) => {
      pushEvent(event);
    });

    return () => {
      unsubscribe?.();
    };
  }, [pushEvent]);

  useEffect(() => {
    const previousButtons = new Map<string, boolean>();
    const previousAxes = new Map<string, boolean>();

    const interval = window.setInterval(() => {
      pollGamepads(previousButtons, previousAxes, pushEvent);
    }, GAMEPAD_POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [pushEvent]);

  return children;
}

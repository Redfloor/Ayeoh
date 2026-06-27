import { useEffect, type ReactNode } from 'react';
import { useAyeohStore } from '../store/ayeohStore';
import { normalizeGamepadAxis, normalizeGamepadButton } from './normalize';
import type { GamepadSnapshot, InputEvent } from './types';

const AXIS_DEADZONE = 0.5;
const GAMEPAD_POLL_INTERVAL_MS = 50;

function pollGamepads(
  previousButtons: Map<string, boolean>,
  previousAxes: Map<string, boolean>,
  onEvent: (event: InputEvent | null) => void,
  onSnapshot: (snapshots: GamepadSnapshot[]) => void,
): void {
  const pads = navigator.getGamepads();
  const snapshots: GamepadSnapshot[] = [];

  for (const pad of pads) {
    if (pad === null) {
      continue;
    }

    snapshots.push({
      index: pad.index,
      id: pad.id,
      buttons: pad.buttons.map((button) => ({ pressed: button.pressed, value: button.value })),
      axes: [...pad.axes],
    });

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

  onSnapshot(snapshots);
}

export function InputProvider({ children }: { children: ReactNode }): ReactNode {
  const pushEvent = useAyeohStore((state) => state.pushEvent);
  const setKeyPressed = useAyeohStore((state) => state.setKeyPressed);
  const setMouseButtonPressed = useAyeohStore((state) => state.setMouseButtonPressed);
  const setGamepads = useAyeohStore((state) => state.setGamepads);

  useEffect(() => {
    const unsubscribeEvent = window.ayeoh?.onInputEvent((event) => {
      pushEvent(event);
    });
    const unsubscribeKeyState = window.ayeoh?.onKeyState(({ key, pressed }) => {
      setKeyPressed(key, pressed);
    });
    const unsubscribeMouseState = window.ayeoh?.onMouseButtonState(({ button, pressed }) => {
      setMouseButtonPressed(button, pressed);
    });

    return () => {
      unsubscribeEvent?.();
      unsubscribeKeyState?.();
      unsubscribeMouseState?.();
    };
  }, [pushEvent, setKeyPressed, setMouseButtonPressed]);

  useEffect(() => {
    const previousButtons = new Map<string, boolean>();
    const previousAxes = new Map<string, boolean>();

    const handleEvent = (event: InputEvent | null): void => {
      if (event !== null) {
        pushEvent(event);
      }
    };

    const interval = window.setInterval(() => {
      pollGamepads(previousButtons, previousAxes, handleEvent, setGamepads);
    }, GAMEPAD_POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [pushEvent, setGamepads]);

  return children;
}

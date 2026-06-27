import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GamepadSnapshot, InputEvent, InputSource } from '../input/types';

const HISTORY_LIMIT = 50;

export type ControllerLayout = 'xbox' | 'generic';

export interface AyeohSettings {
  darkMode: boolean;
  overlayMode: boolean;
  mutedSources: Record<InputSource, boolean>;
  ttsVoiceName: string | null;
  ttsVolume: number;
  micDeviceId: string | null;
  controllerLayout: ControllerLayout;
}

interface AyeohState {
  history: InputEvent[];
  latest: InputEvent | null;
  activeKeys: Record<string, boolean>;
  activeMouseButtons: Record<number, boolean>;
  gamepads: GamepadSnapshot[];
  settings: AyeohSettings;
  pushEvent: (event: InputEvent) => void;
  setKeyPressed: (key: string, pressed: boolean) => void;
  setMouseButtonPressed: (button: number, pressed: boolean) => void;
  setGamepads: (gamepads: GamepadSnapshot[]) => void;
  toggleSourceMute: (source: InputSource) => void;
  setDarkMode: (darkMode: boolean) => void;
  setOverlayMode: (overlayMode: boolean) => void;
  setControllerLayout: (layout: ControllerLayout) => void;
  setTtsVoiceName: (name: string | null) => void;
  setTtsVolume: (volume: number) => void;
  setMicDeviceId: (deviceId: string | null) => void;
}

const defaultSettings: AyeohSettings = {
  darkMode: true,
  overlayMode: false,
  mutedSources: {
    keyboard: false,
    mouse: false,
    gamepad: false,
    voice: false,
  },
  ttsVoiceName: null,
  ttsVolume: 1,
  micDeviceId: null,
  controllerLayout: 'xbox',
};

export const useAyeohStore = create<AyeohState>()(
  persist(
    (set) => ({
      history: [],
      latest: null,
      activeKeys: {},
      activeMouseButtons: {},
      gamepads: [],
      settings: defaultSettings,
      pushEvent: (event) =>
        set((state) => ({
          latest: event,
          history: [event, ...state.history].slice(0, HISTORY_LIMIT),
        })),
      setKeyPressed: (key, pressed) =>
        set((state) => ({
          activeKeys: { ...state.activeKeys, [key]: pressed },
        })),
      setMouseButtonPressed: (button, pressed) =>
        set((state) => ({
          activeMouseButtons: { ...state.activeMouseButtons, [button]: pressed },
        })),
      setGamepads: (gamepads) => set({ gamepads }),
      toggleSourceMute: (source) =>
        set((state) => ({
          settings: {
            ...state.settings,
            mutedSources: {
              ...state.settings.mutedSources,
              [source]: !state.settings.mutedSources[source],
            },
          },
        })),
      setDarkMode: (darkMode) =>
        set((state) => ({ settings: { ...state.settings, darkMode } })),
      setOverlayMode: (overlayMode) =>
        set((state) => ({ settings: { ...state.settings, overlayMode } })),
      setControllerLayout: (controllerLayout) =>
        set((state) => ({ settings: { ...state.settings, controllerLayout } })),
      setTtsVoiceName: (ttsVoiceName) =>
        set((state) => ({ settings: { ...state.settings, ttsVoiceName } })),
      setTtsVolume: (ttsVolume) =>
        set((state) => ({ settings: { ...state.settings, ttsVolume } })),
      setMicDeviceId: (micDeviceId) =>
        set((state) => ({ settings: { ...state.settings, micDeviceId } })),
    }),
    {
      name: 'ayeoh-settings',
      partialize: (state) => ({ settings: state.settings }),
    },
  ),
);

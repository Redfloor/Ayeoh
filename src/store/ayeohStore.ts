import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InputEvent, InputSource } from '../input/types';

const HISTORY_LIMIT = 50;

export interface AyeohSettings {
  darkMode: boolean;
  mutedSources: Record<InputSource, boolean>;
  ttsVoiceName: string | null;
  ttsVolume: number;
  micDeviceId: string | null;
}

interface AyeohState {
  history: InputEvent[];
  latest: InputEvent | null;
  settings: AyeohSettings;
  pushEvent: (event: InputEvent) => void;
  toggleSourceMute: (source: InputSource) => void;
  setDarkMode: (darkMode: boolean) => void;
  setTtsVoiceName: (name: string | null) => void;
  setTtsVolume: (volume: number) => void;
  setMicDeviceId: (deviceId: string | null) => void;
}

const defaultSettings: AyeohSettings = {
  darkMode: true,
  mutedSources: {
    keyboard: false,
    mouse: false,
    gamepad: false,
    voice: false,
  },
  ttsVoiceName: null,
  ttsVolume: 1,
  micDeviceId: null,
};

export const useAyeohStore = create<AyeohState>()(
  persist(
    (set) => ({
      history: [],
      latest: null,
      settings: defaultSettings,
      pushEvent: (event) =>
        set((state) => ({
          latest: event,
          history: [event, ...state.history].slice(0, HISTORY_LIMIT),
        })),
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

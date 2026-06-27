import { useEffect, useRef } from 'react';
import { useAyeohStore } from '../store/ayeohStore';
import type { InputEvent } from './types';

class TtsSpeaker {
  private getVoiceName: () => string | null;
  private getVolume: () => number;

  constructor(getVoiceName: () => string | null, getVolume: () => number) {
    this.getVoiceName = getVoiceName;
    this.getVolume = getVolume;
  }

  speakNow(text: string): void {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.getVolume();

    const voiceName = this.getVoiceName();
    if (voiceName !== null) {
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      if (voice !== undefined) {
        utterance.voice = voice;
      }
    }

    window.speechSynthesis.speak(utterance);
  }
}

export function useTts(): void {
  const latest = useAyeohStore((state) => state.latest);
  const settings = useAyeohStore((state) => state.settings);
  const speakerRef = useRef<TtsSpeaker | null>(null);
  const lastSpokenId = useRef<string | null>(null);

  if (speakerRef.current === null) {
    speakerRef.current = new TtsSpeaker(
      () => useAyeohStore.getState().settings.ttsVoiceName,
      () => useAyeohStore.getState().settings.ttsVolume,
    );
  }

  useEffect(() => {
    if (latest === null || latest.id === lastSpokenId.current) {
      return;
    }
    lastSpokenId.current = latest.id;

    if (shouldSpeak(latest, settings.mutedSources)) {
      speakerRef.current?.speakNow(latest.label);
    }
  }, [latest, settings.mutedSources]);
}

function shouldSpeak(event: InputEvent, mutedSources: Record<string, boolean>): boolean {
  if (event.source === 'voice') {
    return false;
  }
  return !mutedSources[event.source];
}

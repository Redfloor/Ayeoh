import { useEffect, useRef } from 'react';
import { useAyeohStore } from '../store/ayeohStore';
import type { InputEvent } from './types';

class TtsQueue {
  private queue: string[] = [];
  private speaking = false;
  private getVoiceName: () => string | null;
  private getVolume: () => number;

  constructor(getVoiceName: () => string | null, getVolume: () => number) {
    this.getVoiceName = getVoiceName;
    this.getVolume = getVolume;
  }

  enqueue(text: string): void {
    this.queue.push(text);
    this.drain();
  }

  clear(): void {
    this.queue = [];
    window.speechSynthesis.cancel();
    this.speaking = false;
  }

  private drain(): void {
    if (this.speaking || this.queue.length === 0) {
      return;
    }
    const text = this.queue.shift();
    if (text === undefined) {
      return;
    }

    this.speaking = true;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = this.getVolume();

    const voiceName = this.getVoiceName();
    if (voiceName !== null) {
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      if (voice !== undefined) {
        utterance.voice = voice;
      }
    }

    utterance.onend = () => {
      this.speaking = false;
      this.drain();
    };
    utterance.onerror = () => {
      this.speaking = false;
      this.drain();
    };

    window.speechSynthesis.speak(utterance);
  }
}

export function useTts(): void {
  const latest = useAyeohStore((state) => state.latest);
  const settings = useAyeohStore((state) => state.settings);
  const queueRef = useRef<TtsQueue | null>(null);
  const lastSpokenId = useRef<string | null>(null);

  if (queueRef.current === null) {
    queueRef.current = new TtsQueue(
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
      queueRef.current?.enqueue(latest.label);
    }
  }, [latest, settings.mutedSources]);
}

function shouldSpeak(event: InputEvent, mutedSources: Record<string, boolean>): boolean {
  if (event.source === 'voice') {
    return false;
  }
  return !mutedSources[event.source];
}

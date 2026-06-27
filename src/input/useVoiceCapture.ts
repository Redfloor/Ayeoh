import { useEffect } from 'react';
import { startVoiceCapture } from './voiceCapture';

export function useVoiceCapture(): void {
  useEffect(() => {
    let stop: (() => void) | null = null;
    let cancelled = false;

    void window.ayeoh?.isVoiceAvailable().then((available) => {
      if (!available || cancelled) {
        return;
      }
      startVoiceCapture()
        .then((stopCapture) => {
          if (cancelled) {
            stopCapture();
            return;
          }
          stop = stopCapture;
        })
        .catch((error: unknown) => {
          console.error('[useVoiceCapture] failed to start microphone capture:', error);
        });
    });

    return () => {
      cancelled = true;
      stop?.();
    };
  }, []);
}

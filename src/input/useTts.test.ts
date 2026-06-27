import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTts } from './useTts';
import { useAyeohStore } from '../store/ayeohStore';
import { normalizeKeyboard } from './normalize';

describe('useTts', () => {
  let cancel: ReturnType<typeof vi.fn>;
  let speak: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    cancel = vi.fn();
    speak = vi.fn();
    vi.stubGlobal('speechSynthesis', { cancel, speak, getVoices: () => [] });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        text: string;
        volume = 1;
        voice: unknown = null;
        constructor(text: string) {
          this.text = text;
        }
      },
    );

    useAyeohStore.setState({
      latest: null,
      settings: useAyeohStore.getInitialState().settings,
    });
  });

  it('cancels any in-progress speech before speaking the newest input', () => {
    const { rerender } = renderHook(() => useTts());

    const first = normalizeKeyboard('A', 'down');
    const second = normalizeKeyboard('B', 'down');
    if (first === null || second === null) {
      throw new Error('expected events');
    }

    useAyeohStore.setState({ latest: first });
    rerender();
    useAyeohStore.setState({ latest: second });
    rerender();

    expect(cancel).toHaveBeenCalledTimes(2);
    expect(speak).toHaveBeenCalledTimes(2);
  });

  it('does not speak voice input', () => {
    renderHook(() => useTts());
    const event = { id: '1', source: 'voice' as const, transcript: 'hi', label: 'hi', timestamp: 0 };

    useAyeohStore.setState({ latest: event });

    expect(speak).not.toHaveBeenCalled();
  });
});

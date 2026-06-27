import { beforeEach, describe, expect, it } from 'vitest';
import { useAyeohStore } from './ayeohStore';
import { normalizeKeyboard } from '../input/normalize';

describe('useAyeohStore', () => {
  beforeEach(() => {
    useAyeohStore.setState({
      history: [],
      latest: null,
      settings: useAyeohStore.getInitialState().settings,
    });
  });

  it('pushes events into history and tracks the latest one', () => {
    const event = normalizeKeyboard('Space', 'down');
    if (event === null) {
      throw new Error('expected an event');
    }

    useAyeohStore.getState().pushEvent(event);

    expect(useAyeohStore.getState().latest).toEqual(event);
    expect(useAyeohStore.getState().history).toEqual([event]);
  });

  it('caps history length at 50 entries', () => {
    for (let i = 0; i < 60; i += 1) {
      const event = normalizeKeyboard(`Key${i}`, 'down');
      if (event !== null) {
        useAyeohStore.getState().pushEvent(event);
      }
    }

    expect(useAyeohStore.getState().history).toHaveLength(50);
  });

  it('toggles mute state per source', () => {
    expect(useAyeohStore.getState().settings.mutedSources.keyboard).toBe(false);

    useAyeohStore.getState().toggleSourceMute('keyboard');

    expect(useAyeohStore.getState().settings.mutedSources.keyboard).toBe(true);
  });
});

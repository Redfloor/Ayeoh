import { beforeEach, describe, expect, it } from 'vitest';
import { useAyeohStore } from './ayeohStore';
import { normalizeKeyboard } from '../input/normalize';

describe('useAyeohStore', () => {
  beforeEach(() => {
    useAyeohStore.setState({
      history: [],
      latest: null,
      activeKeys: {},
      activeMouseButtons: {},
      gamepads: [],
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

  it('tracks held key state independently of the event log', () => {
    useAyeohStore.getState().setKeyPressed('A', true);
    expect(useAyeohStore.getState().activeKeys.A).toBe(true);

    useAyeohStore.getState().setKeyPressed('A', false);
    expect(useAyeohStore.getState().activeKeys.A).toBe(false);
  });

  it('tracks held mouse button state', () => {
    useAyeohStore.getState().setMouseButtonPressed(1, true);
    expect(useAyeohStore.getState().activeMouseButtons[1]).toBe(true);
  });

  it('stores gamepad snapshots', () => {
    const snapshot = { index: 0, id: 'Test Pad', buttons: [], axes: [] };
    useAyeohStore.getState().setGamepads([snapshot]);

    expect(useAyeohStore.getState().gamepads).toEqual([snapshot]);
  });

  it('toggles overlay mode', () => {
    expect(useAyeohStore.getState().settings.overlayMode).toBe(false);

    useAyeohStore.getState().setOverlayMode(true);

    expect(useAyeohStore.getState().settings.overlayMode).toBe(true);
  });

  it('changes the controller layout', () => {
    useAyeohStore.getState().setControllerLayout('generic');

    expect(useAyeohStore.getState().settings.controllerLayout).toBe('generic');
  });

  it('toggles panel visibility', () => {
    expect(useAyeohStore.getState().settings.visiblePanels.log).toBe(true);

    useAyeohStore.getState().togglePanelVisibility('log');

    expect(useAyeohStore.getState().settings.visiblePanels.log).toBe(false);
  });
});

import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ControllerPanel } from './ControllerPanel';
import { useAyeohStore } from '../../store/ayeohStore';
import { buildTheme } from '../../theme/theme';
import type { GamepadSnapshot } from '../../input/types';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={buildTheme(true, false)}>
      <ControllerPanel />
    </ThemeProvider>,
  );
}

function makeGamepad(overrides: Partial<GamepadSnapshot> = {}): GamepadSnapshot {
  return {
    index: 0,
    id: 'Test Controller',
    buttons: Array.from({ length: 17 }, () => ({ pressed: false, value: 0 })),
    axes: [0, 0, 0, 0],
    ...overrides,
  };
}

describe('ControllerPanel', () => {
  beforeEach(() => {
    useAyeohStore.setState({
      gamepads: [],
      settings: { ...useAyeohStore.getInitialState().settings, controllerLayout: 'xbox' },
    });
  });

  it('shows a placeholder when no controller is connected', () => {
    renderWithTheme();
    expect(screen.getByText(/no controller connected/i)).toBeInTheDocument();
  });

  it('renders a connected controller and highlights a pressed button', () => {
    const gamepad = makeGamepad();
    gamepad.buttons[0] = { pressed: true, value: 1 };
    useAyeohStore.setState({ gamepads: [gamepad] });

    renderWithTheme();

    expect(screen.getByText('Test Controller')).toBeInTheDocument();
    expect(screen.getByText('A')).toHaveStyle({ color: '#fff' });
  });

  it('switches to the generic layout when configured', () => {
    const gamepad = makeGamepad();
    useAyeohStore.setState({
      gamepads: [gamepad],
      settings: { ...useAyeohStore.getInitialState().settings, controllerLayout: 'generic' },
    });

    renderWithTheme();

    expect(screen.getByText('A / Cross')).toBeInTheDocument();
  });
});

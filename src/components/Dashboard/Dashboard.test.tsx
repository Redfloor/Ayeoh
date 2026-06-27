import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { Dashboard } from './Dashboard';
import { useAyeohStore } from '../../store/ayeohStore';
import { buildTheme } from '../../theme/theme';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={buildTheme(true, false)}>
      <Dashboard />
    </ThemeProvider>,
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    useAyeohStore.setState({ settings: useAyeohStore.getInitialState().settings, gamepads: [] });
  });

  it('shows all panels by default', () => {
    renderWithTheme();
    expect(screen.getByLabelText('Keyboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Mouse')).toBeInTheDocument();
    expect(screen.getByLabelText('Controllers')).toBeInTheDocument();
    expect(screen.getByLabelText('Voice')).toBeInTheDocument();
  });

  it('hides a panel when its visibility setting is off', () => {
    useAyeohStore.setState((state) => ({
      settings: {
        ...state.settings,
        visiblePanels: { ...state.settings.visiblePanels, keyboard: false },
      },
    }));

    renderWithTheme();

    expect(screen.queryByLabelText('Keyboard')).not.toBeInTheDocument();
  });
});

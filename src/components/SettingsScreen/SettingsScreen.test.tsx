import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { SettingsScreen } from './SettingsScreen';
import { useAyeohStore } from '../../store/ayeohStore';
import { darkTheme } from '../../theme/theme';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={darkTheme}>
      <SettingsScreen />
    </ThemeProvider>,
  );
}

describe('SettingsScreen', () => {
  beforeEach(() => {
    useAyeohStore.setState({ settings: useAyeohStore.getInitialState().settings });
  });

  it('toggles dark mode', async () => {
    renderWithTheme();
    const toggle = screen.getByLabelText(/dark mode/i);

    await userEvent.click(toggle);

    expect(useAyeohStore.getState().settings.darkMode).toBe(false);
  });

  it('mutes an input source', async () => {
    renderWithTheme();
    const keyboardToggle = screen.getByLabelText(/keyboard/i);

    await userEvent.click(keyboardToggle);

    expect(useAyeohStore.getState().settings.mutedSources.keyboard).toBe(true);
  });
});

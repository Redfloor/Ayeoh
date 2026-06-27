import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Layout } from './Layout';
import { useAyeohStore } from '../../store/ayeohStore';
import { buildTheme } from '../../theme/theme';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={buildTheme(true, false)}>
      <Layout />
    </ThemeProvider>,
  );
}

describe('Layout', () => {
  beforeEach(() => {
    useAyeohStore.setState({ settings: useAyeohStore.getInitialState().settings, gamepads: [] });
  });

  it('quits the app when the close button is clicked', async () => {
    const quitApp = vi.fn();
    window.ayeoh = { ...window.ayeoh, quitApp } as typeof window.ayeoh;

    renderWithTheme();
    await userEvent.click(screen.getByLabelText(/close ayeoh/i));

    expect(quitApp).toHaveBeenCalledTimes(1);
  });
});

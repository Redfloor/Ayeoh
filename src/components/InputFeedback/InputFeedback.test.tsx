import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { InputFeedback } from './InputFeedback';
import { useAyeohStore } from '../../store/ayeohStore';
import { darkTheme } from '../../theme/theme';
import { normalizeKeyboard } from '../../input/normalize';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={darkTheme}>
      <InputFeedback />
    </ThemeProvider>,
  );
}

describe('InputFeedback', () => {
  beforeEach(() => {
    useAyeohStore.setState({ latest: null, history: [] });
  });

  it('shows a prompt when no input has happened yet', () => {
    renderWithTheme();
    expect(screen.getByText(/press a key/i)).toBeInTheDocument();
  });

  it('shows the latest input label', () => {
    const event = normalizeKeyboard('Space', 'down');
    if (event === null) {
      throw new Error('expected an event');
    }
    useAyeohStore.setState({ latest: event });

    renderWithTheme();

    expect(screen.getByText('Space')).toBeInTheDocument();
  });
});

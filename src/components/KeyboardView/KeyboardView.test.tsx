import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { KeyboardView } from './KeyboardView';
import { useAyeohStore } from '../../store/ayeohStore';
import { buildTheme } from '../../theme/theme';

function renderWithTheme(): ReturnType<typeof render> {
  return render(
    <ThemeProvider theme={buildTheme(true, false)}>
      <KeyboardView />
    </ThemeProvider>,
  );
}

describe('KeyboardView', () => {
  beforeEach(() => {
    useAyeohStore.setState({ activeKeys: {} });
  });

  it('renders the full layout including the space bar', () => {
    renderWithTheme();
    expect(screen.getByText('Esc')).toBeInTheDocument();
    expect(screen.getByText('Tab')).toBeInTheDocument();
    expect(screen.getAllByText('Enter').length).toBeGreaterThan(0);
  });

  it('highlights a held key', () => {
    useAyeohStore.setState({ activeKeys: { A: true } });
    renderWithTheme();

    expect(screen.getByText('A')).toHaveStyle({ color: '#fff' });
  });
});
